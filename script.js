let cityInput = document.getElementById("cityInput");
let goFetchButton = document.getElementById("goFetch");
let city = cityInput.value;
// if metric is true, the api will be called with unit parameter set to metric giving output in celcius
let metric = true;

window.onload = function () {
    city = "bangalore";
    initiate("bangalore");
}

document.getElementById("metricSwitch").onclick = function () {
    metric = !(metric);
    initiate(city);
}

goFetchButton.onclick = function () {
    city = cityInput.value;
    initiate(city);
}

function initiate(city) {
    if(city == "") return;
    document.getElementById("dateTime").textContent = new Date().toDateString();
    getResponse();

}
async function getResponse() {
    let apiKey = "eb57036f7021cf149bdf747d11dc1ef5";
    //https://api.openweathermap.org/data/2.5/weather?q=london&appid=eb57036f7021cf149bdf747d11dc1ef5
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    let u = "\xB0F";
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=" + apiKey;
    if(metric){
    //https://api.openweathermap.org/data/2.5/weather?q=london&appid=eb57036f7021cf149bdf747d11dc1ef5&units=metric
        url = url + "&units=metric";
        u = "\xB0C"
    }
    // console.log(url);
    const response = await fetch( url, {mode: "cors", units: "metric"});
    const weatherData = await response.json();
    console.log(weatherData);
    document.getElementById("cityState").textContent = weatherData.name + ", " + weatherData.sys.country;
    document.getElementById("tempValue").textContent = weatherData.main.temp + u;
    // weather icon src example = http://openweathermap.org/img/wn/10d@2x.png
    document.getElementById("cTimg").src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    // Feels like 10°C. Scattered clouds. Gentle Breeze
    document.getElementById("extraInfo").textContent = "Feels like " + weatherData.main.feels_like + u+". " + weatherData.weather[0].main+". " + weatherData.weather[0].description; 
    document.getElementById("moreExtra").textContent = "Humidity: " + weatherData.main.humidity + "% ";
    document.getElementById("spdWind").textContent = weatherData.wind.speed + "m/s";
    document.getElementById("degWind").textContent = degToCompass(weatherData.wind.deg);
    document.getElementById("visiValue").textContent = (weatherData.visibility/1000 + "km") || ("6.3km");
}

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}