// DOM Variabls
var sideBar = document.getElementById("sidebarSearch");
var searchEl = document.getElementById("searchButton");
var inputEl = document.getElementById("inputCity");
var cityList = document.getElementById("cityList");
var todayEl = document.getElementById("today");
var fiveDayEl = document.getElementById("fiveDay");
var forecastEl = document.getElementById("forecastCards")
var lastUpdateEl = document.createElement('h3');
var updaterEl = document.createElement('button');
updaterEl.setAttribute('id', 'updater');
updaterEl.innerText = "Update Now";
// Global Variables
var apiKey = '679579c74563b14f3d59e1876e9cfe37';
var alertEl = document.createElement('p');
var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
var lata = 0;
var long = 0;
var cityName;
var cityState;
var cityCountry;
var citySearch;
var forecastArray = [];

// Page Setup
genSavedCities();

//Functions

function genSavedCities () {
    savedCitiesList = JSON.parse(localStorage.getItem("savedCities"));
    if (savedCitiesList != null){
        savedCitiesList.forEach(function (item, index, array){
            btnName = savedCitiesList[index];
            genCityButton(btnName);
        })
    }
}

function searchWeather (event) {
    event.preventDefault();
    if (inputEl.value != ""){
        alertEl.innerText="";
        citySearch = inputEl.value;
        inputEl.value = "";
        grabLocation();
    }
    else {
        alertEl.innerText = "Please Enter A City";
        sideBar.appendChild(alertEl);
    }
}

function genCityButton (citySearch){
        var btn = document.createElement('button')
        btn.innerText = citySearch;
        btn.setAttribute('id', citySearch);
        var listEl = document.createElement("li")
        listEl.appendChild(btn);
        cityList.appendChild(listEl);   
}

function grabLocation() {
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${citySearch}&limit=1&appid=${apiKey}`)
	.then(function(response) {
            return response.json();
        })
    .then(function (data) {
        console.log(data);
        if (data.length === 0){
            alertEl.innerText="Unable to Locate. Please check spelling.";
            sideBar.appendChild(alertEl)
        }
        else {
            lata = data[0].lat;
            long = data[0].lon;
            cityName = data[0].name;
            cityState = data[0].state;
            cityCountry = data[0].country;
            if(!savedCities.includes(cityName)) {
                savedCities.push(cityName);
                localStorage.setItem("savedCities", JSON.stringify(savedCities));
                genCityButton(cityName);
            }
            else {
                alertEl.innerText="Already Created";
                sideBar.appendChild(alertEl)
            }
            grabWeather(lata, long);
        }
    })
}

function grabWeather(lata, long) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lata}&lon=${long}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){  
            //current information
            todayTemp = data.current.temp;
            todayWind = data.current.wind_speed;
            todayHumi = data.current.humidity;
            todayUV = data.current.uvi;
            currentTime = moment().format('LLLL');
            //Five Day Forcast Information
            for (i=0;i<=4;i++){
                var date = moment().add(i, 'days').format('LL');
                var fiveTemp = data.daily[i].temp.day;
                var fiveWind = data.daily[i].wind_speed;
                var fiveHumid = data.daily[i].humidity;
                var icon = data.daily[i].weather[0].icon;
                var fiveIcon ="http://openweathermap.org/img/wn/"+icon+"@2x.png";
                var forecastObj = 
                    {
                    "date": date,
                    "temp": "Temp " + fiveTemp + String.fromCharCode(176) + " F",
                    "wind": "Wind: " + fiveWind + " MPH",
                    "humidity": "Humidity: " + fiveHumid + " %", 
                    "icon": fiveIcon,
                    }
            
                forecastArray.push(forecastObj);
            }
            localStorage.setItem(cityName+"FiveDay", JSON.stringify(forecastArray));
            forecastArray = [];
            var recentSearch = [
                {"cityName": cityName,
                 "cityState":cityState,
                 "cityCountry":cityCountry,
                 "updater": currentTime,
                 "cityLat": lata,
                 "cityLong": long,
                 "temp": "Temp " + todayTemp + String.fromCharCode(176) + " F",
                 "wind": "Wind: " + todayWind + " MPH",
                 "humidity": "Humidity: " + todayHumi + " %",
                 "uvIndex": todayUV,}
            ]
   
            JSON.stringify(recentSearch);
            localStorage.setItem(citySearch, JSON.stringify(recentSearch))
            console.log(data);
            
            fillToday();
            fiveDay();
        })
    }


function fillToday () {
    // Clear out current contents of today box
    clrContent (todayEl);
    console.log("Clear Complete");
    //DOM Variables
    headerEl = document.createElement('h1');
    tempEl = document.createElement('p');
    windEl = document.createElement('p');
    humidEl = document.createElement('p');
    uvEl = document.createElement('p');
    uvSpan = document.createElement('button');
    uvSpan.setAttribute('id', 'uvBtn')
    //pull the stored data to fill out today's weather info
    data = (JSON.parse(localStorage.getItem(citySearch)));
    headerEl.innerText = cityName + ", " + cityState + ", " + cityCountry
    todayEl.appendChild(headerEl);
    tempEl.innerText = data[0].temp;
    windEl.innerText = data[0].wind;
    humidEl.innerText = data[0].humidity;
    uvSpan.innerText = data[0].uvIndex;
        if (data[0].uvIndex < 3){
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

function fiveDay () {
    //Clear out any previously generated cards
    clrContent (forecastEl);
    //pull the local storage data for the city we looked up
    forecastArray = JSON.parse(localStorage.getItem(`${cityName}FiveDay`));
    //loop through the data and create 5 cards based on it.
    for (i=0; i <= 4; i++){

        divEl = document.createElement('div');
        dateEl = document.createElement('p');
        tempEl = document.createElement('p');
        windEl = document.createElement('p');
        humidEl = document.createElement('p');

        divEl.classList.add('card');

        dateEl.innerText = forecastArray[i].date;
        tempEl.innerText = forecastArray[i].temp;
        windEl.innerText = forecastArray[i].wind;
        humidEl.innerText = forecastArray[i].humidity;
        image = new Image(50,50)
        image.src= forecastArray[i].icon

        divEl.appendChild(dateEl);
        divEl.appendChild(image);
        divEl.appendChild(tempEl);
        divEl.appendChild(windEl);
        divEl.appendChild(humidEl);
        forecastCards.appendChild(divEl);
        }
}

function savedCityData (event) {
    clrContent(todayEl);
    clrContent(forecastEl);
//Pull the current data
    element = event.target;
    savedCity = JSON.parse(localStorage.getItem(element.id));
//Html elements
    headerEl = document.createElement('h1');
    tempEl = document.createElement('p');
    windEl = document.createElement('p');
    humidEl = document.createElement('p');
    uvEl = document.createElement('p');
    uvSpan = document.createElement('button');
    uvSpan.setAttribute('id', 'uvBtn')
    updaterEl.setAttribute('id', 'updater');
//Creating the header elements for current weather box.
    headerEl.innerText = savedCity[0].cityName + " ," + savedCity[0].cityState + " ," + savedCity[0].cityCountry;
    lastUpdateEl.innerText = "Last Updated: " + savedCity[0].updater;
    todayEl.appendChild(headerEl);
    lastUpdateEl.appendChild(updaterEl);
    todayEl.appendChild(lastUpdateEl);
//Assigning the stored values for the clicked city.
    tempEl.innerText = savedCity[0].temp;
    windEl.innerText = savedCity[0].wind;
    humidEl.innerText = savedCity[0].humidity;
//Set a CSS class to change the color based on UV values.
    uvSpan.innerText = savedCity[0].uvIndex;
        if (savedCity[0].uvIndex < 3){
            uvSpan.classList.add("uvLow");
        }
        else if (savedCity[0].uvIndex >=3 && savedCity[0].uvIndex <= 5){
            uvSpan.classList.add("uvMod");
        }
        else if (savedCity[0].uvIndex >= 6 && savedCity[0].uvIndex <=7){
            uvSpan.classList.add("uvHigh");
        }
        else {
            uvSpan.classList.add("uvSevere");
        }
    uvEl.innerText = "UV Index: ";
// Push all the created elements to index.html to display the current weather.
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

function whatIsUV() { 
    window.open('https://www.epa.gov/sunsafety/uv-index-scale-0', '_blank')
} 

//event listeners
searchEl.addEventListener("click", searchWeather);
cityList.addEventListener("click", savedCityData);
todayEl.addEventListener("click", whatIsUV);
