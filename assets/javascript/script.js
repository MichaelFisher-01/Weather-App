
var apiKey = '679579c74563b14f3d59e1876e9cfe37';
var lata = 0;
var long = 0;
var city = 'Denver';


grabLocation().then((grabWeather())).then((grabForcast));




function grabLocation() {
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
	.then(function(response) {
            return response.json();
        })
    .then(function (data){
        lata = data[0].lat;
        long = data[0].lon;
        console.log(lata);
        console.log(long);
        console.log(data);
        })
}

function grabWeather() {
    console.log(lata);
    console.log(long);
    console.log(apiKey);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lata}&lon=${long}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data)
        })
    }
function grabForcast() {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lata}&lon=${long}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data)
        })
    }
