"use strict";

const url = "https://villodata.herokuapp.com/api/data";

async function getData(){
    console.log("fetching...");
    const response = await fetch(url);
    const villoData = await response.json();
    //console.log(villoData);
    const data = villoData.map(d => {
      return {
        latitude: d.position.latitude,
        longitude: d.position.longitude,
        bikes: d.mainStands.availabilities.bikes
      };
    });

    //date => javascript date object maken
    //dag van de week, uur (16.35 => 17u)
    //station => station id in het model verwerken 

    console.log(data);
}

getData();


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






