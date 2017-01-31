var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    firebase = require("firebase"),
    crypto = require('crypto');
config = require('./config');

firebase.initializeApp({
    serviceAccount: "Security Training System-a15133fc4d08.json",
    databaseURL: config.databaseURL
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

app.post("/receta/add", function(req, res) {
    var title = req.query.title;
    var description = req.query.description;
    var duration = req.query.duration;
    var ingredients = req.query.ingredients;

    if (typeof title === "undefined" || typeof description === "undefined" || typeof duration === "undefined" || typeof ingredients === "undefined") {
        res.send('err')
    } else {
        var Id = crypto.createHash('md5').update(title + description + duration + ingredients).digest("hex");
        if (busqueda_recetas_duplicadas(Id)) {
            res.send("La receta ya estaba añadida");
        }else{
          var db = firebase.database();
          var ref = db.ref("recetasDB")
          var usersRef = ref.child('recetas');
          usersRef.push({
              id: Id,
              titulo: title,
              descripcion: description,
              duracion: duration,
              ingredientes: ingredients
          });
          res.send('receta añadida');
        }
    }
});

app.get("/receta/list", function(req, res) {
    // Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref("recetasDB/recetas");

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot, prevChildKey) {
        var newPost = snapshot.val();
        console.log("titulo: " + newPost.titulo);
        console.log("descripcion: " + newPost.descripcion);
        console.log("duracion: " + newPost.duracion);
        console.log("ingredientes: " + newPost.ingredientes);
        console.log("Previous Post ID: " + prevChildKey);
        console.log("---------------------------");
        res.send(newPost);
    });
});

app.post("/token-device/:nombre", function(req, res) {
    console.log(req.params.nombre);
    var token = req.body.token;
    var db = firebase.database();
    var tokenDevices = db.ref("token-device");
    tokenDevices.set({
        token: token
    });
    res.send(req.body.token);
});

app.get("/token-device", function(req, res) {
    // Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref("token-device");

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        res.send(snapshot.val());
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

router.get('/', function(req, res) {
    res.send("Hello World!");
});

app.use(router);

app.listen(8080, function() {
    console.log("Node server running on http://localhost:8080");
});

function busqueda_recetas_duplicadas(id) {
    var db = firebase.database();
    var enc = false;
    var ref = db.ref("recetasDB/recetas");
    ref.orderByChild("id").equalTo(id).on("child_added", function(snapshot) {
        if (snapshot.numChildren() === 0) {
          console.log("entor");
            enc = true;
        }
    });
    return enc;
}
