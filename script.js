
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
    getResponse();

}
async function getResponse() {
    document.getElementById("loadingScreen").style.visibility = "visible";
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
    document.getElementById("cityState").textContent = weatherData.name + ", " + await fullCountry(weatherData.sys.country); 
    document.getElementById("tempValue").textContent = weatherData.main.temp + u;
    dateTime(weatherData.timezone);
    // weather icon src example = http://openweathermap.org/img/wn/10d@2x.png
    document.getElementById("cTimg").src = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    // Feels like 10°C. Scattered clouds. Gentle Breeze
    document.getElementById("extraInfo").textContent = "Feels like " + weatherData.main.feels_like + u+". " + weatherData.weather[0].main+". " + weatherData.weather[0].description; 
    document.getElementById("moreExtra").textContent = "Humidity: " + weatherData.main.humidity + "% ";
    document.getElementById("spdWind").textContent = weatherData.wind.speed + "m/s";
    document.getElementById("degWind").textContent = degToCompass(weatherData.wind.deg);
    document.getElementById("visiValue").textContent = (weatherData.visibility/1000 + "km") || ("6.3km");
    document.getElementById("sunrise").textContent = timeConverter(weatherData.sys.sunrise);
    document.getElementById("sunset").textContent = timeConverter(weatherData.sys.sunset);
    document.getElementById("minTemp").textContent = weatherData.main.temp_min;
    document.getElementById("maxTemp").textContent = weatherData.main.temp_max;
    document.getElementById("loadingScreen").style.visibility = "hidden";

}

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}
function dateTime(tz){
    let cell = document.getElementById("dateTime");
    let date = new Date();
    date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (1000 * tz));
    let day = date.toUTCString().substring(0, 3);
    let dc = date.getDate();
    let dm = date.toUTCString().substring(8, 11);
    let m = date.getMinutes();
    let h = date.getHours() ;
    cell.textContent = (day + " " + dc + ", " + h + ": " + m)
}
function timeConverter(UNIX_timestamp){
    // utc to human readable time ..
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec ;
    return time;
}
async function fullCountry(code) {
    //http://api.worldbank.org/v2/country/br?format=json
    let url = "https://api.worldbank.org/v2/country/" + code + "?format=json";
    let response = await fetch(url, {mode: "cors"});
    let data = await response.json();
    let name = await data[1][0].name;
    return name;
}

cityInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        event.preventDefault();
        goFetchButton.click();
    }
});