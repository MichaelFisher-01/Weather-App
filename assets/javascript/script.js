// DOM Variabls
var searchEl = document.getElementById("searchButton");
var inputEl = document.getElementById("inputCity");
var cityList = document.getElementById("cityList");

// Global Variables
var apiKey = '679579c74563b14f3d59e1876e9cfe37';
var lata = 0;
var long = 0;
var city;

//Functions
function searchWeather (event) {
    event.preventDefault();
    city = inputEl.value;
    inputEl.value = "";
    console.log(city);
    genCityButton(city);
}

function genCityButton (city){
    var btn = document.createElement('button')
    btn.innerText = city;
    var listEl = document.createElement("li")
    listEl.appendChild(btn);
    cityList.appendChild(listEl);

}

function grabLocation() {
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
	.then(function(response) {
            return response.json();
        })
    .then(function (data){
        lata = data[0].lat;
        long = data[0].lon;
        grabWeather(lata, long);
        })
}

function grabWeather(lata, long) {
    console.log(lata);
    console.log(long);
    console.log(apiKey);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lata}&lon=${long}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data)
        })
    }

//event listeners
searchEl.addEventListener("click", searchWeather);

