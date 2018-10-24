const express = require("express");
const server = express();
const PORT = process.env.PORT || 5000;

var mongoose = require("mongoose");

const mlabURI = 'mongodb://root:abcd1234@ds211083.mlab.com:11083/restful-api';

mongoose.connect(mlabURI, { useNewUrlParser: true }, (error) => {
    if(error){
        console.log("Error: " + error);
    } else {
        console.log("Connected successfully to server");
    }
});

server.listen(PORT, () => console.log(`RESTFULAPIs Server on ${PORT}!`));