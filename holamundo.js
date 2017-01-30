var http = require('http'), fs = require("fs");

var controller = function(req,res){
  console.log("Holamundo");
  res.end("Holamundo");
};

var server = http.createServer(controller);

server.listen(8080);
