const express = require('express');
const multer = require('multer');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/upload', express.static('upload'));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });


const users = {}
const allMsgs = []

app.get("/", function(req, res) {
  res.send("Hello")
});

app.post('/msg/post/', upload.single('img'), function(req, res) {
  const user = req.body.user;
  const msg = req.body.msg;
  const img = req.file ? req.file.path : undefined;
  if (user && users[user] && (msg || img)) {
    console.log(req.body);
    allMsgs.push({ user: user, msg: msg, img: img });
    res.json({ "code": 1, "id": allMsgs.length - 1 });
  } else if (user && users[user]) {
    res.json({ "code": 0 });
  } else {
    res.json({ "code": -1 });
  }
});

app.get('/msg/get/:id', function(req, res) {
  const id = +req.params.id;
  const { user, msg, img } = allMsgs[id];
  if (Number.isInteger(id) && msg !== undefined) {
    res.json({ "code": 1, "msg": { user: users[user], img: img, msg: msg } });
  } else {
    res.json({ "code": 0 });
  }
});

app.get('/msg/getAll', function(req, res) {
  const msgs = allMsgs.map(msg => {
    return { user: users[msg.user], msg: msg.msg, img: msg.img }
  });
  res.json({ "code": 1, "msgs": msgs });
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

app.get('/user/:id/:name', function(req, res) {
  const id = req.params.id;
  const username = req.params.name;
  if (id && username && username.trim() !== "") {
    console.log(id, username);
    users[id] = username.trim();
    setTimeout(() => {
      res.json({ "code": 1, "id": id, "user": username });
    }, 200);
  } else {
    res.status(400).send({
      message: 'Failed to update username'
    });
  }
});

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

