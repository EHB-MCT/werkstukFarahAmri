"use strict";

//SERVER SET-UP
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const path = require('path');
const axios = require('axios');

//API urls
const url = "https://api.jcdecaux.com/vls/v3/stations?contract=Bruxelles&apiKey=c5747f5adf36d81ba83846a75cc1d2d4b4116ab3";
const apiUrl = "https://villodata.herokuapp.com/api/data";

//MONGO DB SETUP
const {
    MongoClient,
    ObjectID
} = require('mongodb');
const {
    response
} = require('express');
const uri = "mongodb+srv://admin:admin@cluster0.lxqft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const databaseName = "data";
let db, collection;

//MIDDLEWARE
app.use(cors());
app.use(express.json({
    limit: '200mb'
}));
app.use(express.urlencoded({
    limit: '200mb',
    extended: true
}));

//ROUTER
const apiRouter = express.Router();

//ROOT
app.get('/', (req, res) => {
    //res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

apiRouter.route('/data')
    .post(async (req, res) => {
        collection = db.collection("villoData");
        collection.insertMany(req.body)
            .then(result => {
                console.log(result);
                res.send("data is saved");
            })
            .catch(error => console.error(error));
    })
    .get((req, res) => {
        collection = db.collection("villoData");
        const {
            query
        } = req;
        collection.find(query).toArray((err, result) => {
            if (err) {
                return res.send(err);
            }
            res.json(result);
        });
    });


axios.get(url) //functie gewoon axios.get via interval
    .then(response => {
        let apiResult = response.data; 
        //console.log(apiResult);
        axios.post(apiUrl, {apiResult})
            .then(response =>{
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    })
    .catch(error => {
        console.log(error);
    });


//APP USE
app.use(express.static(path.join(__dirname, 'front')));
app.use('/api', apiRouter);

//MONGO DB CONNECTION
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    client.connect(err => {
        if (err) {
            throw err;
        }
        db = client.db(databaseName);
        console.log("connected");
    });
});