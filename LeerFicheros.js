var http = require("http"),
fs = require("fs");

http.createServer(function(req, res) {
  var html = fs.readFile("./index.html", function(err, html) {
    //for (var i = 0; i < 20; i++) {
    //        r   es.write(html);
    //}
    res.writeHead(200, {
      "Conten-Type": "application/json"
    });
    res.write(JSON.stringify({
      nombre: "borja",
      username: "b10"
    }));
    res.end();
  });
}).listen(8080);
