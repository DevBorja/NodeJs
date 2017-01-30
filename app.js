var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    firebase = require("firebase"),
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

    console.log(title, description, duration, ingredients);

    if (typeof title ==="undefined"  || typeof description ==="undefined"  || typeof duration ==="undefined" || typeof ingredients ==="undefined" )  {
        res.send('err')
    } else {
        var Id = Math.round(Math.random()*10000);
        var db = firebase.database();
        var ref = db.ref("recetasDB/recetas")
        var usersRef = ref.child(Id);
        usersRef.set({
            titulo: title,
            descripcion: description,
            duracion: duration,
            ingredientes: ingredients
        });
        res.send('receta añadida');
    }
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
    console.log("Node server running on http://localhost:3000");
});
