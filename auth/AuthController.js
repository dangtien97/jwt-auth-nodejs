const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../user/User');
;
const VerifyToken = require("./VerifyToken");

const router = express();

router.use(bodyParser.urlencoded(
  {
    extened: false
  }
));
router.use(bodyParser.json());

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
          config.secretKey, {
            expiresIn: 86400
          });
          res.status(200).send({
            auth: true,
            token: token
          });
        }
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
