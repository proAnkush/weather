
// to do - clean up
// to do - remove logs

let cityInput = document.getElementById("cityInput");
let goFetchButton = document.getElementById("goFetch");
let city = cityInput.value;
let u = "\xB0F";
// if metric is true, the api will be called with unit parameter set to metric giving output in celcius
let metric = Boolean(localStorage.getItem("metric"));

window.onload = function () {
    city = "bangalore";
    initiate("bangalore");
}

document.getElementById("metricSwitch").onclick = function () {
    metric = !(metric);
    if(metric){
        document.getElementById("metricSwitch").innerHTML = "<b>&deg;C</b>/&deg; F";
        u = "\xB0C";
    }
    else{
        document.getElementById("metricSwitch").innerHTML = "&deg;C/<b>&deg;F</b>";
        u = "\xB0F";
    }
    initiate(city);
}

document.getElementById("refresh").onclick = function () {
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
    
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=" + apiKey;
    console.log(url);
    u = "\xB0F";
    if(metric){
        url = url + "&units=metric";
        u = "\xB0C"
    }
    // console.log(url);
    try{
        // hide
        document.getElementById("loadingScreen").style.visibility = "visible";
        document.getElementById("errorScreen").style.visibility = "hidden";
        
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
        document.getElementById("moreExtra").innerHTML = "<b>Humidity:</b> " + weatherData.main.humidity + "% " + "<b>High:</b> " + weatherData.main.temp_max + u + " <b>Low:</b> " + weatherData.main.temp_min;

        // more info card
        document.getElementById("spdWind").textContent = weatherData.wind.speed + "m/s";
        document.getElementById("degWind").textContent = degToCompass(weatherData.wind.deg);
        document.getElementById("visiValue").textContent = (weatherData.visibility/1000 + "km") || ("6.3km");
        document.getElementById("sunrise").textContent = timeConverter(weatherData.sys.sunrise);
        document.getElementById("sunset").textContent = timeConverter(weatherData.sys.sunset);
        
        
        
        // one call = oc
        // https://api.openweathermap.org/data/2.5/onecall?lat=12.9762&lon=77.6033&appid=eb57036f7021cf149bdf747d11dc1ef5
        let ocurl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=" + apiKey;
        if(metric){
            ocurl = ocurl + "&units=metric";
        }
        const ocResponse = await fetch(ocurl, {mode: "cors"});
        const ocData = await ocResponse.json();
        // end
        
        // hourly forecast populate
        let hout = ocData.hourly;
        let hourly = document.getElementById("hourly");
        hourly.innerHTML = "";
        for(let i = 0 ; i < hout.length; i++){
            hourly.appendChild(createHFCcard(hout[i], i == 0));
        }
        // end

        // Daily forecase table

        
        console.log("ocur");
        console.log(ocData);
        // hide loading screen
        document.getElementById("loadingScreen").style.visibility = "hidden";
        
    }catch(error){
        // show appropriate
        document.getElementById("errorScreen").style.visibility = "visible";
        document.getElementById("loadingScreen").style.visibility = "hidden";
        return;
    }
}

function createHFCcard(hour, now) {
    let hCard = document.createElement('hCard');
    hCard.classList.add("hCard");
    let t = document.createElement("span");
    t.classList.add("hcHead");

    let date = new Date();
    date = timeConverter(hour.dt);
    t.textContent = (date.charAt(1) ==':') ? date.substring(0,1) : date.substring(0,2);
    if(now) {
        t.textContent = "Now";
        console.log(hour.pop * 100);
        document.getElementById("cor").innerHTML = "<b>Chance Of Rain:</b> " + (hour.pop * 100) + "%";
    }
    hCard.appendChild(t);
    let i = document.createElement("img");
    i.classList.add("hcImg");
    i.setAttribute("alt", "forecast icon");
    i.src = "https://openweathermap.org/img/wn/" + hour.weather[0].icon + "@2x.png";
    hCard.appendChild(i);
    let temp = document.createElement("span");
    temp.classList.add("hcTemp");
    temp.textContent = hour.temp + u;
    hCard.appendChild(temp);
    return hCard;
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