var lat = 0;
var lon = 0;
var place = 'Denver';

console.log("test");



function grabLocation() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
            'X-RapidAPI-Key': 'f67cb71206mshc366dc7a6bc7cc6p1e7a9djsn309d42298c5c'
        }
    };
    
    fetch('https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${place}&accept-language=en&polygon_threshold=0.0', options)
	.then(function(response) {
            return response.json();
        })
    .then(function (data){
        console.log(data);
        })
}

/*function grabWeather()_{
    console.log("Im here too!")
}*/