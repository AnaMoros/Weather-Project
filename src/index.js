// Weather buttons
let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", handleSearchSubmit); // search bar and button

let currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", findLocation); // current location

let degreeButton = document.querySelector("#degree-button");
degreeButton.addEventListener("click", convertTemp); //change between C and F

let weatherData = null;

//functions to run when page re/loads
searchCity("London");
// all functions

function findLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
} // find position of user with locator button

function showPosition(position) {
  let apiKey = "139a278dab2d6efb890bf5a9eddefa09";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let unit = `metric`;
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateLocationInfo);
} // sends user location to Weather API

function handleSearchSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput = cityInput.value.trim().toLowerCase();
  searchCity(cityInput);
} // handles the behaviour of the search bar

function searchCity(city) {
  let apiKey = "139a278dab2d6efb890bf5a9eddefa09";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(updateLocationInfo);
} // sends the city the user searches for to Weather API

function updateLocationInfo(response) {
  weatherData = response.data;
  updateTime(response.data.dt);
  updateDate(response.data.dt);
  updateTemp(response.data.main.temp);
  updateWeatherDescription(response.data.weather[0].description);
  updateCity(response.data.name);
  updateCountry(response.data.sys.country);
  updateFeelsTemp(response.data.main.feels_like);
  updateHighTemp(response.data.main.temp_max);
  updateLowTemp(response.data.main.temp_min);
  //updateChanceOfRain(); -- work in progress
  updateWindSpeed(response.data.wind.speed);
  updateHumidity(response.data.main.humidity);
  updateIcon(response.data.weather[0].id);
  runForecast(response.data.coord.lat, response.data.coord.lon);
  //updateUVIndex(); --CURRENTLY NO UV DATA BEING RECIEVED --!!
} // all functions to run and update the page

function runForecast(lat, lon) {
  let apiKey = "139a278dab2d6efb890bf5a9eddefa09";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let units = `metric`;
  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["THU", "FRI", "SAT", "SUN", "MON", "TUE"];
  days.forEach(function (day) {
    forecastHTML += `<div class="col-6 col-sm-2 day1" id="day1">
            <ul>
              <li class="day1-day" id="day1-day">${day}</li>
              <li class="day1-weather" id="day1-weather">
                <img
                  src="src/svg/wi-day-cloudy-high.svg"
                  alt=""
                  class="day1-weather-img"
                  id="day1-weather-img"
                  width="50px"
                />
              </li>
              <li class="day1-temp" id="day1-temp">
                <span class="day1-low-temp" id="day1-low-temp">12</span>°
                <span class="day1-high-temp" id="day1-high-temp">16</span>°
              </li>
            </ul>
          </div>`;
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
displayForecast();

function updateTemp(temp) {
  let currentTemp = document.querySelector("#today-number-temp");
  currentTemp.innerHTML = Math.round(temp);
} // updates the temperature of the current city

function updateCity(cityName) {
  let city = document.querySelector("#city");
  city.innerHTML = cityName.toUpperCase();
} // updates the city name

function updateCountry(countryCode) {
  let country = document.querySelector("#country");
  country.innerHTML = countryCode.toUpperCase();
} // updates the country

function updateFeelsTemp(feelsTemp) {
  let temp = document.querySelector("#feels-temp");
  let feelsTempRound = Math.round(feelsTemp);
  temp.innerHTML = `${feelsTempRound}°`;
} // updates the feels like temp

function updateWeatherDescription(description) {
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = description;
} // updates the current weather description

function updateHighTemp(highTemp) {
  let temp = document.querySelector("#high-temp");
  let highTempRound = Math.round(highTemp);
  temp.innerHTML = `${highTempRound}°`;
} // updates the highest temperature of the day

function updateLowTemp(lowTemp) {
  let temp = document.querySelector("#low-temp");
  let lowTempRound = Math.round(lowTemp);
  temp.innerHTML = `${lowTempRound}°`;
} // updates the lowest temperature of the day

//function updateChanceOfRain()

function updateWindSpeed(windSpeedData) {
  let windSpeed = document.querySelector("#wind-speed");
  windSpeedRound = Math.round(windSpeedData * 100) / 100;
  windSpeed.innerHTML = `${windSpeedRound} kmh`;
} // updates the current wind speed

function updateHumidity(humidityData) {
  let humidity = document.querySelector("#humidity-percent");
  humidity.innerHTML = `${humidityData}%`;
} // updates the current humidity

function updateUVIndex(uvi) {
  let uvIndex = document.querySelector("#uv-index");
  let answer;
  switch (uvi) {
    case 0:
    case 1:
    case 2:
      answer = "Low";
      break;
    case 3:
    case 4:
    case 5:
      answer = "Moderate";
      break;
    case 6:
    case 7:
      answer = "High";
      break;
    case 8:
    case 9:
    case 10:
      answer = "Very High";
      break;
    default:
      answer = "Extreme";
  }
  uvIndex.innerHTML = answer;
} //updates the current uv index --CURRENTLY NO UV DATA BEING RECIEVED --!!

function convertTemp() {
  let degreeButton = document.querySelector("#degree-button");
  if (degreeButton.innerHTML === "°F") {
    convertToImperial();
    swapToCButton();
  } else {
    convertToMetric();
    swapToFButton();
  }
} // ChangeS the temperature buttons when pressed

function convertToImperial() {
  let todayTemp = document.querySelector("#today-number-temp");
  todayTemp.innerHTML = Math.round((weatherData.main.temp * 9) / 5 + 32);

  let feelsTemp = document.querySelector("#feels-temp");
  let feelsTempRound = Math.round((weatherData.main.feels_like * 9) / 5 + 32);
  feelsTemp.innerHTML = `${feelsTempRound}°`;

  let highTemp = document.querySelector("#high-temp");
  let highTempRound = Math.round((weatherData.main.temp_max * 9) / 5 + 32);
  highTemp.innerHTML = `${highTempRound}°`;

  let lowTemp = document.querySelector("#low-temp");
  let lowTempRound = Math.round((weatherData.main.temp_min * 9) / 5 + 32);
  lowTemp.innerHTML = `${lowTempRound}°`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeedRound = Math.round((weatherData.wind.speed / 1.609344) * 100) / 100;
  windSpeed.innerHTML = `${windSpeedRound} mph`;
} // formula to convert celsius to farenheit and change the text

function convertToMetric() {
  let todayTemp = document.querySelector("#today-number-temp");
  todayTemp.innerHTML = Math.round(weatherData.main.temp);

  let feelsTemp = document.querySelector("#feels-temp");
  let feelsTempRound = Math.round(weatherData.main.feels_like);
  feelsTemp.innerHTML = `${feelsTempRound}°`;

  let highTemp = document.querySelector("#high-temp");
  let highTempRound = Math.round(weatherData.main.temp_max);
  highTemp.innerHTML = `${highTempRound}°`;

  let lowTemp = document.querySelector("#low-temp");
  let lowTempRound = Math.round(weatherData.main.temp_min);
  lowTemp.innerHTML = `${lowTempRound}°`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeedRound = Math.round(weatherData.wind.speed * 100) / 100;
  windSpeed.innerHTML = `${windSpeedRound} kph`;
} // formula to convert farenheit to celsius to and change the text

function swapToCButton() {
  let degreeButton = document.querySelector("#degree-button");
  degreeButton.innerHTML = "°C";
  let degree = document.querySelector("#degree");
  degree.innerHTML = "°F";
} // changes the text of the button to C

function swapToFButton() {
  let degreeButton = document.querySelector("#degree-button");
  degreeButton.innerHTML = "°F";
  let degree = document.querySelector("#degree");
  degree.innerHTML = "°C";
} // changes the text of the button to F

function updateTime(unixDate) {
  let currentDate = new Date(unixDate * 1000);
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let time = `${hour}:${minutes}`;
  let theTime = document.querySelector("#the-time");
  theTime.innerHTML = `${time}`;
} // updates to the current time

function updateDate(unixDate) {
  let currentDate = new Date(unixDate);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[currentDate.getDay()].toUpperCase();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[currentDate.getMonth()].toUpperCase();
  let date = currentDate.getDate();
  let theDate = document.querySelector("#the-date");
  theDate.innerHTML = `${day} ${date} ${month}`;
} //updates to the current date

function updateIcon(imgID) {
  let imgName;
  let currentIcon = document.querySelector("#today-weather-img");
  let now = new Date(weatherData.dt * 1000);
  let sunrise = new Date(weatherData.sys.sunrise * 1000);
  let sunset = new Date(weatherData.sys.sunset * 1000);
  if (now >= sunrise && now <= sunset) {
    switch (imgID) {
      case 200:
      case 201:
      case 202:
      case 230:
      case 231:
      case 232:
        imgName = "day-thunderstorm";
        break;
      case 210:
      case 211:
      case 212:
      case 221:
        imgName = "day-lightning";
        break;
      case 300:
      case 301:
      case 321:
      case 500:
        imgName = "day-sprinkle";
        break;
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 501:
      case 502:
      case 503:
      case 504:
        imgName = "day-rain";
        break;
      case 511:
      case 611:
      case 612:
      case 615:
      case 616:
      case 620:
        imgName = "day-rain-mix";
        break;
      case 520:
      case 521:
      case 522:
      case 701:
        imgName = "day-showers";
        break;
      case 531:
        imgName = "day-storm-showers";
        break;
      case 600:
      case 602:
      case 621:
      case 622:
        imgName = "day-snow";
        break;
      case 601:
        imgName = "day-sleet";
        break;
      case 711:
        imgName = "smoke";
        break;
      case 721:
        imgName = "day-haze";
        break;
      case 731:
      case 761:
      case 762:
        imgName = "dust";
        break;
      case 741:
        imgName = "day-fog";
        break;
      case 781:
      case 900:
        imgName = "tornado";
        break;
      case 800:
        imgName = "day-sunny";
        break;
      case 801:
      case 802:
      case 803:
        imgName = "day-cloudy-gusts";
        break;
      case 804:
        imgName = "day-sunny-overcast";
        break;
      case 902:
        imgName = "hurricane";
        break;
      case 903:
        imgName = "snowflake-cold";
        break;
      case 904:
        imgName = "hot";
        break;
      case 906:
        imgName = "day-hail";
        break;
      case 957:
        imgName = "strong-wind";
    }
    currentIcon.setAttribute("src", `src/svg/wi-${imgName}.svg`);
  } else {
    switch (imgID) {
      case 200:
      case 201:
      case 202:
      case 230:
      case 231:
      case 232:
        imgName = "night-alt-thunderstorm";
        break;
      case 210:
      case 211:
      case 212:
      case 221:
        imgName = "night-alt-lightning";
        break;
      case 300:
      case 301:
      case 321:
      case 500:
        imgName = "night-alt-sprinkle";
        break;
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 501:
      case 502:
      case 503:
      case 504:
        imgName = "night-alt-rain";
        break;
      case 511:
      case 611:
      case 612:
      case 615:
      case 616:
      case 620:
        imgName = "night-alt-rain-mix";
        break;
      case 520:
      case 521:
      case 522:
      case 701:
        imgName = "night-alt-showers";
        break;
      case 531:
        imgName = "night-alt-storm-showers";
        break;
      case 600:
      case 602:
      case 621:
      case 622:
        imgName = "night-alt-snow";
        break;
      case 601:
        imgName = "night-alt-sleet";
        break;
      case 711:
        imgName = "smoke";
        break;
      case 721:
        imgName = "day-haze";
        break;
      case 731:
      case 761:
      case 762:
        imgName = "dust";
        break;
      case 741:
        imgName = "night-fog";
        break;
      case 781:
      case 900:
        imgName = "tornado";
        break;
      case 800:
        imgName = "night-clear";
        break;
      case 801:
      case 802:
      case 803:
        imgName = "night-alt-cloudy-gusts";
        break;
      case 804:
        imgName = "night-alt-cloudy";
        break;
      case 902:
        imgName = "hurricane";
        break;
      case 903:
        imgName = "snowflake-cold";
        break;
      case 904:
        imgName = "hot";
        break;
      case 906:
        imgName = "night-alt-hail";
        break;
      case 957:
        imgName = "strong-wind";
    }
  }
  currentIcon.setAttribute("src", `src/svg/wi-${imgName}.svg`);
}
