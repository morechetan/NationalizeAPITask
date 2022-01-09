const url = "https://api.nationalize.io";

var dataList=[];

//for fetch response based on input name from nationalize API
async function getData(name) {
  let data;
  try {
    const resp = await fetch(url + "/?name=" + name, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await resp.json();
  } catch (e) {
    console.log(e);
    alert("Error: "  + e.message);
  }
  return data;
}

//listening onclick function for predict button
async function predict() {
  let name = document.querySelector("#predict-name").value;

  if (name != null && name.trim().length > 0) {
    let details = await getData(name.trim());
    //console.log(details);
    if (details != null) {
      serachDisplay(details);
      addToDataList(details);
    }
  } else alert("Please enter name to Predict Nationality!!");
}

//display fetched nationalize data from API
let serachDisplay = (details) => {
  let size = Math.min(details.country.length, 2);

  let displayDiv = document.querySelector("#display");
  let displayHTML = "";
  if (size > 0) {
    displayHTML += `<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Country Id</th>
      <th>Probability</th>
    </tr>
  </thead>
  <tbody> 
  `;

    for (let i = 0; i < size; i++) {
      let country = details.country[i];
      
      displayHTML += `<tr>
            <td>${details.name}</td>
            <td>${country.country_id}</td>
            <td>${country.probability}</td>
            </tr>`;
    }
    displayHTML += `</tbody></table>`;
  }
  else{
    displayHTML+=`<p> No prediction found for name: ${details.name} </p>`;
  }
  displayDiv.innerHTML = displayHTML;
};

//for adding fetched data from API to local variable dataList
function addToDataList(details){
  for(let i = 0; i < details.country.length;i++){
      if(dataList.filter(d => d.name === details.name.toUpperCase() && d.country === details.country[i].country_id).length == 0){
       dataList.push({name:details.name.toUpperCase(),country:details.country[i].country_id,probability:details.country[i].probability});
     }
  }
}

// filter on name 

let searchBoxName = document.querySelector("#search-box-name")
searchBoxName.addEventListener("keyup",function(){
   let textEntered= searchBoxName.value
searchBoxCountry.value="";
let filteredDetails=[];
filteredDetails=dataList.filter(function(data){
  return data.name.toLowerCase().includes(textEntered.toLowerCase())
})
displayTable(filteredDetails)

})

// filter on country id
let searchBoxCountry = document.querySelector("#search-box-country")
searchBoxCountry.addEventListener("keyup",function(){
   let textEntered= searchBoxCountry.value
searchBoxName.value="";
let filteredDetails=[];

filteredDetails=dataList.filter(function(data){
  return data.country.toLowerCase().includes(textEntered.toLowerCase())
})

displayTable(filteredDetails)

})

//display all fetched history entries

let allDetailsButton=document.querySelector("#all-details")
allDetailsButton.addEventListener('click',function(){
  searchBoxCountry.value="";
  searchBoxName.value="";
  displayTable(dataList)
})

//for displaying filtered data into Table
let displayTable=(details)=>{
  let table=document.querySelector("#table-display")
  let displayHTML="";
  
  displayHTML += `<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Country Id</th>
      <th>Probability</th>
    </tr>
  </thead>
  <tbody> 
  `;
  for(let detail of details){
    displayHTML+=`<tr>
      <td>${detail.name}</td>
      <td>${detail.country}</td>
      <td>${detail.probability}</td>
      </tr>`;
      
  }
  displayHTML += `</tbody></table>`;
  table.innerHTML=displayHTML;
}