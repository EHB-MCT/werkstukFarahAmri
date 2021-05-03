"use strict";

const url = "https://api.jcdecaux.com/vls/v3/stations?contract=Bruxelles&apiKey=c5747f5adf36d81ba83846a75cc1d2d4b4116ab3";
const apiUrl = "http://localhost:3000/api/data";

async function getData(){
    console.log("fetching...");
    const response = await fetch(url);
    const json = await response.json();
    //console.log(json.mainStands);
    renderData(json);
    saveData(json);
}

getData();

//setInterval(getData, 1800000);

async function saveData(data){
    let request = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      return await request.json(); 
}

function renderData(json){
    console.log(json);
    let placeholder = document.getElementById('data');
    let htmlString = "";

    htmlString += JSON.stringify(json);

    placeholder.insertAdjacentHTML("afterbegin", htmlString);
}






