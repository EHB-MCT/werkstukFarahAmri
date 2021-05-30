"use strict";

const url = "http://localhost:3000";

async function getData() {
  console.log("fetching...");
  const response = await fetch(url);
  const villoData = await response.json();
  let data = villoData.map(d => {
    // let weekdagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    const date = new Date(d.lastUpdate);
    const year = date.getFullYear();
    const weekdag = date.getDay();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const hours = date.getHours();
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let minutesInt = date.getMinutes();

    const fullDate = `${day}/${month}/${year}`;
    const fullTime = `${hours}:${minutes}`;

    return {
      bikes: d.mainStands.availabilities.bikes,
      number: d.number,
      day: weekdag,
      date: fullDate,
      fulltime: fullTime
    };
  });

  data = JSON.stringify(data);
  
  console.log(data);
  
  return data;
  
}

getData();

// async function run() {
//   // Load and plot the original input data that we are going to train on.
//   const json = await getData();
//   const values = json.map(d => ({
//     x: d.number,
//     y: d.bikes,
//   }));

//   tfvis.render.scatterplot({
//     name: 'station v bikes'
//   }, {
//     values
//   }, {
//     xLabel: 'station',
//     yLabel: 'bikes',
//     height: 300
//   });

//   const model = createModel();
//   tfvis.show.modelSummary({
//     name: 'Model Summary'
//   }, model);

//   // Convert the data to a form we can use for training.
//   const tensorData = convertToTensor(json);
//   const {
//     inputs,
//     labels
//   } = tensorData;

//   // Train the model
//   await trainModel(model, inputs, labels);
//   console.log('Done Training');
//   // More code will be added below
//   testModel(model, json, tensorData);
  
//   //const saveResult = await model.save('localstorage://my-model-1');

// }

// document.addEventListener('DOMContentLoaded', run);

// function createModel() {
//   // Create a sequential model
//   const model = tf.sequential();

//   // Add a single input layer
//   model.add(tf.layers.dense({
//     inputShape: [1],
//     units: 1,
//     useBias: true
//   }));

//   // Add an output layer
//   model.add(tf.layers.dense({
//     units: 1,
//     useBias: true
//   }));

//   return model;
// }

// function convertToTensor(data) {
//   // Wrapping these calculations in a tidy will dispose any
//   // intermediate tensors.

//   return tf.tidy(() => {
//     // Step 1. Shuffle the data
//     tf.util.shuffle(data);

//     // Step 2. Convert data to Tensor
//     const inputs = data.map(d => d.number);
//     const labels = data.map(d => d.bikes);

//     const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
//     const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

//     //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
//     const inputMax = inputTensor.max();
//     const inputMin = inputTensor.min();
//     const labelMax = labelTensor.max();
//     const labelMin = labelTensor.min();

//     const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
//     const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

//     return {
//       inputs: normalizedInputs,
//       labels: normalizedLabels,
//       // Return the min/max bounds so we can use them later.
//       inputMax,
//       inputMin,
//       labelMax,
//       labelMin,
//     };
//   });
// }

// async function trainModel(model, inputs, labels) {
//   // Prepare the model for training.
//   model.compile({
//     optimizer: tf.train.adam(),
//     loss: tf.losses.meanSquaredError,
//     metrics: ['mse'],
//   });

//   const batchSize = 24;
//   const epochs = 32;

//   return await model.fit(inputs, labels, {
//     batchSize,
//     epochs,
//     shuffle: true,
//     callbacks: tfvis.show.fitCallbacks({
//         name: 'Training Performance'
//       },
//       ['loss', 'mse'], {
//         height: 200,
//         callbacks: ['onEpochEnd']
//       }
//     )
//   });
// }

// function testModel(model, inputData, normalizationData) {
//   const {inputMax, inputMin, labelMin, labelMax} = normalizationData;

//   // Generate predictions for a uniform range of numbers between 0 and 1;
//   // We un-normalize the data by doing the inverse of the min-max scaling
//   // that we did earlier.
//   const [xs, preds] = tf.tidy(() => {

//     const xs = tf.linspace(0, 1, 100);
//     const preds = model.predict(xs.reshape([100, 1]));

//     const unNormXs = xs
//       .mul(inputMax.sub(inputMin))
//       .add(inputMin);

//     const unNormPreds = preds
//       .mul(labelMax.sub(labelMin))
//       .add(labelMin);

//     // Un-normalize the data
//     return [unNormXs.dataSync(), unNormPreds.dataSync()];
//   });


//   const predictedPoints = Array.from(xs).map((val, i) => {
//     return {x: val, y: preds[i]};
//   });

//   const originalPoints = inputData.map(d => ({
//     x: d.number, y: d.bikes,
//   }));


//   tfvis.render.scatterplot(
//     {name: 'Model Predictions vs Original Data'},
//     {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
//     {
//       xLabel: 'station',
//       yLabel: 'bikes',
//       height: 300
//     }
//   );
// }


// FUCTIONS FOR DATA COLLECTING

// async function saveData(data){
//     let request = await fetch(apiUrl, {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });
//       return await request.json(); 
// }

// function renderData(json){
//     console.log(json);
//     let placeholder = document.getElementById('data');
//     let htmlString = "";

//     htmlString += JSON.stringify(json);

//     placeholder.insertAdjacentHTML("afterbegin", htmlString);
// }