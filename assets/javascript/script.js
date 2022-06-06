// DOM Variabls
var sideBar = document.getElementById("sidebarSearch");
var searchEl = document.getElementById("searchButton");
var inputEl = document.getElementById("inputCity");
var cityList = document.getElementById("cityList");
var todayEl = document.getElementById("today");

// Global Variables
var apiKey = '679579c74563b14f3d59e1876e9cfe37';
var alertEl = document.createElement('p');
var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
localStorage.setItem(savedCities, JSON.stringify(savedCities));
var lata = 0;
var long = 0;
var city;
var todayTemp;
var todayWind;
var todayHumi;
var todayUV;
var forcastDate;
var forcastImg;
var forcastTemp;
var forcastWind;
var forcastHumi;
// Page Setup

genSavedCities();

//Functions

function genSavedCities () {
    savedCities.forEach(function (item, index, array){
        console.log(savedCities[index]);
        genCityButton(savedCites[index]);
    })

}

function searchWeather (event) {
    event.preventDefault();
    if (inputEl.value != ""){
        alertEl.innerText="";
        city = inputEl.value;
        inputEl.value = "";
        grabLocation();
        genCityButton(city);
    }
    else {
        alertEl.innerText = "Please Enter A City";
        sideBar.appendChild(alertEl);
    }
}

function genCityButton (city){
    var btn = document.createElement('button')
    btn.innerText = city;
    btn.setAttribute('id', city);
    var listEl = document.createElement("li")
    listEl.appendChild(btn);
    cityList.appendChild(listEl);
    savedCities.push(city);
    localStorage.setItem(savedCities, JSON.stringify(savedCities));
    localStorage.setItem(savedCities, JSON.stringify(savedCities));
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
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lata}&lon=${long}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            savedCities.push(city);   
            todayTemp = data.current.temp;
            todayWind = data.current.wind_speed;
            todayHumi = data.current.humidity;
            todayUV = data.current.uvi;
            var recentSearch = [
                {"cityName": city,
                "temp": "Temp " + todayTemp + String.fromCharCode(176) + " F",
                 "wind": "Wind: " + todayWind + " MPH",
                 "humidity": "Humidity: " + todayHumi + " %",
                 "uvIndex": todayUV,}
            ]
            JSON.stringify(recentSearch);
            localStorage.setItem(city, JSON.stringify(recentSearch))
            fillToday();

        })
    }


function fillToday () {
    clrContent (todayEl)
    headerEl = document.createElement('h1');
    tempEl = document.createElement('p');
    windEl = document.createElement('p');
    humidEl = document.createElement('p');
    uvEl = document.createElement('p');
    uvSpan = document.createElement('button');
    uvSpan.setAttribute('id', 'uvBtn')
    data = (JSON.parse(localStorage.getItem(city)));
    headerEl.innerText = data[0].cityName;
    todayEl.appendChild(headerEl);
    tempEl.innerText = data[0].temp;
    windEl.innerText = data[0].wind;
    humidEl.innerText = data[0].humidity;
    uvSpan.innerText = data[0].uvIndex;
        if (data[0].uvIndex <= 2){
            uvSpan.classList.add("uvLow");
        }
        else if (data[0].uvIndex >=3 && data[0].uvIndex <= 5){
            uvSpan.classList.add("uvMod");
        }
        else if (data[0].uvIndex >= 6 && data[0].uvIndex <=7){
            uvSpan.classList.add("uvHigh");
        }
        else {
            uvSpan.classList.add("uvSevere");
        }
    uvEl.innerText = "UV Index: ";
    uvEl.append(uvSpan);
    todayEl.appendChild(tempEl);
    todayEl.appendChild(windEl);
    todayEl.appendChild(humidEl);
    todayEl.appendChild(uvEl);
}



function clrContent (area){
    while (area.firstChild){
        area.removeChild(area.firstElementChild);
    }
}
//event listeners
searchEl.addEventListener("click", searchWeather);

