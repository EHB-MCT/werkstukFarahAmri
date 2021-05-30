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
        inputs: ['number', 'day'],
        outputs: ['bikes'],
        task: 'regression',
        debug: true,
        learningRate: 0.001
    }, modelLoaded);
}

function modelLoaded() {
    console.log('loaded');
    model.normalizeData();
    model.train({
         batchSize: 500,
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
    console.log(day);
    let number = Number(document.getElementById("mystation").value);
    console.log(number);
    console.log('done!');
    //predict
    model.predict([number, day], function(err, result){
        if(err){
            console.error(err);
        }
        let showOnHtml = document.getElementById('result');

        result.map(el => {showOnHtml.innerText = Math.round(el.bikes);});

        console.log(result);
    });
}


