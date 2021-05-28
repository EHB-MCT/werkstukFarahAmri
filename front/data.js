"use strict";

const url = "http://localhost:8000/api/data";

async function getData(){
    console.log("fetching...");
    const response = await fetch(url);
    const villoData = await response.json();
    const data = villoData.map(d => {
      let weekdagen = ['Maandag', 'Dinsdag','Woensdag','Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
      const date = new Date(d.lastUpdate);
      const year = date.getFullYear();
      const weekdag = weekdagen[date.getDay()];
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);

      const hours = date.getHours();
      let minutes = ('0'+ date.getMinutes()).slice(-2);

      const fullDate = `${weekdag}, ${day}/${month}/${year}`;
      const fullTime = `${hours}:${minutes}`;

      return {
        number: d.number,
        date: fullDate,
        hour: fullTime,
        bikes: d.mainStands.availabilities.bikes
      };
    });

    console.log(data);
}

getData();




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