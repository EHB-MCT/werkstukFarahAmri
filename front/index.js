"use strict";

let model;
const mymap = L.map('mapid').setView([50.8465573, 4.351697], 10);
const marker = L.marker([0,0]).addTo(mymap);

submitForm();

function submitForm() {
    let form = document.getElementById("form");

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        setup();
        //getLatAndLong();
    });
}


function setup() {
    model = ml5.neuralNetwork({
        dataUrl: 'data.json',
        inputs: ['number', 'day', 'hour', 'minutes'],
        outputs: ['bikes'],
        task: 'regression',
        debug: true,
        learningRate: 0.0001
    }, modelLoaded);
}

function modelLoaded() {
    console.log('loaded');
    model.normalizeData();
    model.train({
        batchSize: 50,
        epochs: 10
    }, whileTraining, doneTraining);
}

function whileTraining(epoch, loss) {
    console.log(loss);
    console.log(`epoch: ${epoch}, loss: ${loss}`);
}


function doneTraining() {
    let date = new Date(document.getElementById("mydate").value);
    let day = date.getDay();
    // console.log(day);
    let number = Number(document.getElementById("mystation").value);
    console.log(number);
    let time = document.getElementById("mytime").value;
    let array = time.split(":");
    let hour = parseInt(array[0]);
    console.log(hour);
    let minutes = parseInt(array[1]);
    console.log(minutes);
    console.log('done!');

    //predict

    model.predict([number, day, hour, minutes], function (err, result) {
        if (err) {
            console.error(err);
        }
        //let showOnHtml = document.getElementById('result');


        result.map(el => {
            //showOnHtml.innerText = el.bikes;
            getLatAndLong(el.bikes);
        });

        console.log(result);
    });
}


async function fetchStations() {
    let dropdown = document.getElementById("mystation");
    dropdown.length = 0;

    let url = 'https://api.jcdecaux.com/vls/v3/stations?contract=Bruxelles&apiKey=c5747f5adf36d81ba83846a75cc1d2d4b4116ab3';

    const response = await fetch(url);
    const stations = await response.json();
    stations.map((d) => {
        let option;
        option = document.createElement('option');
        option.text = d.name;
        option.value = d.number;

        dropdown.add(option);
    });
}

fetchStations();

function generateMap() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmFyYWhhbXJpIiwiYSI6ImNrcGNnZGhtbDAwN3AydXBobG84cnUyemIifQ.OIzonTyh0WExSBezW9gslg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZmFyYWhhbXJpIiwiYSI6ImNrcGNnZGhtbDAwN3AydXBobG84cnUyemIifQ.OIzonTyh0WExSBezW9gslg'
    }).addTo(mymap);
}

async function getLatAndLong(bikes){
    let url = 'https://api.jcdecaux.com/vls/v3/stations?contract=Bruxelles&apiKey=c5747f5adf36d81ba83846a75cc1d2d4b4116ab3';
    let latitude, longitude, number;
    let value = Number(document.getElementById("mystation").value);

    const response = await fetch(url);
    const data = await response.json();
    
    data.map((d) => {
        number = d.number;
        latitude = d.position.latitude;
        longitude = d.position.longitude;

        if(value === number){
            marker.setLatLng([latitude,longitude]).addTo(mymap);
            marker.bindPopup(`er zullen ${bikes} fietsen beschikbaar zijn`).openPopup();
        }    

        return {
            num: number,
            lat: latitude,
            long: longitude
        };
    });
}

generateMap();