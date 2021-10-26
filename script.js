let cityInput = document.getElementById("cityInput");
let goFetchButton = document.getElementById("goFetch");
let metric = true;

document.getElementById("metricSwitch").onclick = function () {
    metric = !(metric);
    goFetchButton.click();
}

goFetchButton.onclick = initiate;

function initiate() {
    if(cityInput.value == "") return;
    document.getElementById("dateTime").textContent = new Date().toDateString();
    getResponse();

}
async function getResponse(params) {
    let apiKey = "eb57036f7021cf149bdf747d11dc1ef5";
    //https://api.openweathermap.org/data/2.5/weather?q=london&appid=eb57036f7021cf149bdf747d11dc1ef5
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+cityInput.value+"&appid=" + apiKey;
    const response = await fetch( url, {mode: "cors", units: "metric"});
    const weatherData = await response.json();
    console.log(weatherData);
    document.getElementById("cityState").textContent = weatherData.name + ", " + weatherData.sys.country;
    document.getElementById("tempValue").textContent = weatherData.main.temp + "\xB0C";
    // weather icon src example = http://openweathermap.org/img/wn/10d@2x.png
    document.getElementById("cTimg").src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    // Feels like 10°C. Scattered clouds. Gentle Breeze
    document.getElementById("extraInfo").textContent = "Feels like " + weatherData.main.feels_like + "\xB0C. " + weatherData.weather[0].main+". " + weatherData.weather[0].description; 
}