var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

const allMsgs = ["Hello World", "foobar", "CentraleSupelec Forever"]
// let compteur = 0;

app.get("/", function(req, res) {
  res.send("Hello")
});

app.get('/msg/post/:msg', function(req, res) {
  if (req.params.msg !== " ") {
    console.log(req.params.msg);
    // compteur += 1;
    // allMsgs[compteur] = unescape(req.params.msg);
    allMsgs.push(req.params.msg)
    res.json({ "code": 1, "id": allMsgs.length - 1 });
  } else {
    res.json({ "code": 0 })
  }

});

app.get('/msg/get/:id', function(req, res) {
  const id = +req.params.id;
  const msg = allMsgs[id];
  if (Number.isInteger(id) && msg !== undefined) {
    res.json({ "code": 1, "msg": msg });
  } else {
    res.json({ "code": 0 });
  }
});

app.get('/msg/getAll', function(req, res) {
  res.json({ "code": 1, "msgs": allMsgs });
});

app.get('/msg/nber', function(req, res) {
  res.json({ "code": 1, "nber": allMsgs.length });
});

app.get('/msg/del/:id', function(req, res) {
  const id = +req.params.id;
  const msg = allMsgs[id];
  if (Number.isInteger(id) && msg !== undefined) {
    delete allMsgs[id];
    res.json({ "code": 1, "id": id });
  } else {
    res.json({ "code": 0 });
  }
});

// app.get('/cpt/query', function(req, res) {
//   res.json({ "compteur": compteur })
// });

// app.get('/cpt/inc', function(req, res) {
//   const increment = +req.query.v;
//   if (Object.keys(req.query).length === 0) {
//     compteur += 1;
//     res.json({ "code": 0 });
//   } else if (Number.isInteger(increment)) {
//     compteur += increment;
//     res.json({ "code": 0 })
//   } else {
//     res.json({ "code": -1 })
//   }
// });


app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

