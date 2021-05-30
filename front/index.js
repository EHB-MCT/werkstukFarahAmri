"use strict";

let model;

submitForm();

function submitForm(){
    let form = document.getElementById("form");

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        setup();
    });
}


function setup() {
    model = ml5.neuralNetwork({
        dataUrl: 'data.json',
        inputs: ['number','day','hour', 'minutes'],
        outputs: ['bikes'],
        task: 'regression',
        layers: [
            {
              type: 'dense',
              units: 16,
              activation: 'relu'
            },
            {
              type: 'dense',
              units: 16,
              activation: 'sigmoid'
            },
            {
              type: 'dense',
              activation: 'sigmoid'
            }],
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

    model.predict([number, day, hour, minutes], function(err, result){
        if(err){
            console.error(err);
        }
        let showOnHtml = document.getElementById('result');

        result.map(el => {showOnHtml.innerText = el.bikes;});

        console.log(result);
    });
}


async function fetchStations(){
    let dropdown = document.getElementById("mystation");
    dropdown.length = 0;

    let url = 'https://api.jcdecaux.com/vls/v3/stations?contract=Bruxelles&apiKey=c5747f5adf36d81ba83846a75cc1d2d4b4116ab3';

    const response = await fetch(url);
    const stations = await response.json();
    stations.map((d) =>{
        let option;
        option = document.createElement('option');
        option.text = d.name;
        option.value = d.number;
       
        dropdown.add(option);
    });
}

fetchStations();