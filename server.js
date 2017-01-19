
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
var multer = require('multer');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './app/images')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname)
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('app'));



var db;
var dbuser = process.env.DBUSER;
var dbpassword = process.env.DBPASSWORD;

MongoClient.connect('mongodb://'+dbuser+':'+dbpassword+'@ds015909.mlab.com:15909/ea-peli', (err, database) => {
    if (err) {
        return console.log(err);
    }
    db = database;
    app.listen(process.env.PORT || 8000, () => {
        console.log('listening on 8000');
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.post('/api/questions', (req, res) => {

    db.collection('questions').save(req.body, (err, result) => {
        if (err) return res.status(500).send(err);

        console.log('saved to database');
        return res.status(200).send(result);
    })
});

app.post('/api/uploadimage', function(req, res) {
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,err_desc:null});
    })
});

app.get('/api/questions', (req, res) => {
    db.collection('questions').find().toArray(function(err, results) {
        if (err) return res.status(500).send(err);

        return res.status(200).send(results);
    });
});

app.delete('/api/deletequestion', (req, res) => {
    console.log(req.body);
    try {
        db.collection('questions').remove({_id:ObjectId(req.body.id)});
    } catch (err) {
        console.log(err);
        return res.send(500, err);
    }
    console.log("delete onnistui");
    return res.status(200).send("OK");
});