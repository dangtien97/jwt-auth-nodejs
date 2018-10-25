const express = require("express");
const Auth = require("./auth/AuthController");
const server = express();
const PORT = process.env.PORT || 5000;

var mongoose = require("mongoose");

const mlabURI = 'mongodb://root:abcd1234@ds211083.mlab.com:11083/restful-api';

mongoose.connect(mlabURI, { useNewUrlParser: true }, (error) => {
    if(error){
        console.log("Error: " + error);
    } else {
        console.log("Connected successfully to mlab database");
    }
});

server.listen(PORT, () => console.log(`RESTFULAPIs Server on ${PORT}!`));

server.get('/api', (req,res) => {
  res.status(200).send('Api works');
});

server.use('/api/auth', Auth);
