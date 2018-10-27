const jwt = require("jsonwebtoken");
const config = require("../config/config");

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if(!token) {
    res.status(401).send({
      message: 'Unauthorized'
    });
  } else {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if(err) {
        res.status(401).send({
          message: "Token is invalid",
          error: err
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}

module.exports = verifyToken;