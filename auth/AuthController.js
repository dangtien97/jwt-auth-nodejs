const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../user/User');
const Token = require("../token/Token");
const VerifyToken = require("./VerifyToken");

const router = express();

router.use(bodyParser.urlencoded(
  {
    extened: true
  }
));
router.use(bodyParser.json());

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, x-access-token");
  next();
});

router.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  },
    function(err, user) {
      if (err) {
        return res.status(500).send({
          message: 'Internal server error',
          error: err
        });
      } else {
        const token = jwt.sign(
          {
            id: user._id
          },
          config.secretKey,
          {
            expiresIn: 86400
          },
        );
        res.status(200).send({
          auth: true,
          token: token,
        });
      }
    });
});

router.get('/me', VerifyToken, (req, res, next) => {
  User.findById(req.userId, {
    password: 0
  }, function(err, user) {
    if (err) {
      return res.status(500).send({
        message: 'Internal server error',
        error: err
      });
    } else {
      if (!user) {
        return res.status(404).send({
          message: "Not found information"
        });
      } else {
        return res.status(200).send(user);
      }
    }
  });
});

router.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      res.status(500).send({
        message: "Internal server error",
        error: err
      });
    } else {
      if (!user) {
        res.status(404).send({
          message: "Not found information"
        });
      } else {
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          res.status(401).send({
            auth: false,
            token: null
          });
        } else {
          const token = jwt.sign(
          {
            id: user._id
          },
          config.secretKey, 
          {
            expiresIn: 60
          }
          );
          let refreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          Token.create({
            refreshToken: refreshToken,
            userId: user._id,
          }, (err, resToken) => {
            if(err) {
              res.status(500).send({
                message: 'Internal server error',
                error: err,
              });
            }
          });
          res.status(200).send({
            auth: true,
            token: token,
            refreshToken: refreshToken,
          });
        }
      }
    }
  });
});

router.post('/refresh-token', (req, res) => {
  const userId = req.body.userId;
  const refreshToken = req.body.refreshToken;
  Token.findOne({
    userId: userId,
    refreshToken: refreshToken,
  }, (err, resToken) => {
    if(err) {
      res.status(500).send({
        message: "Internal server error",
      });
    } else {
      if(!resToken) {
        res.status(401).send({
          message: "Unauthorized",
        });
      } else {
        const token = jwt.sign
        (
          {
            id: userId
          },
            config.secretKey, 
          {
            expiresIn: 300
          }
        );
        res.status(200).send({
          token: token,
        });
      }
    }
  });
});

router.get('/logout', (req, res) => {
  res.status(200).send({
    message: "Log out successfully",
    token: null,
  });
});

module.exports = router;
