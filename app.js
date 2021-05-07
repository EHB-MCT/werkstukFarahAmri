"use strict";

//SERVER SET-UP
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
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


function request() {
    axios.get(url)
        .then(response => {
            let apiResult = response.data;
            console.log(apiResult);
            collection = db.collection("villoData");
            collection.insertMany(apiResult)
                .then(result => {
                    console.log(result);
                })
                .catch(error => console.error(error));
        })
        .catch(error => {
            console.error(error);
        });
}

setInterval(request, 1800000);

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