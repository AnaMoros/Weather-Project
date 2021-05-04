const apiKey = "139a278dab2d6efb890bf5a9eddefa09";
const apiEndpoint = `https://api.openweathermap.org/data/2.5/`;
const currentWeatherAPI = `weather?`;
const oneCallApi = `onecall?`;

// Weather buttons
let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", handleSearchSubmit); // search bar and button

let currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", findLocation); // current location

let degreeButton = document.querySelector("#degree-button");
degreeButton.addEventListener("click", convertTemp); //change between C and F

let weatherData = null;

//functions to run when page re/loads
searchCity("London"); // 51.5085 -0.1257
// all functions

function handleSearchSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput = cityInput.value.trim().toLowerCase();
  searchCity(cityInput);
} // handles the behaviour of the search bar

function searchCity(city) {
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}${currentWeatherAPI}q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then((res) => {
    let { name } = res.data;
    let { country } = res.data.sys;
    let { lat, lon } = res.data.coord;
    showPosition(lat, lon);
    updateCity(name);
    updateCountry(country);
  });
} // sends the city the user searches for to Weather API

function findLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    showPosition(latitude, longitude);
  });
} // find latitute and longiture of the user with locator button

function showPosition(lat, lon) {
  let unit = `metric`;

  let apiUrl = `${apiEndpoint}${currentWeatherAPI}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then((res) => {
    let { name } = res.data;
    let { country } = res.data.sys;
    updateCity(name);
    updateCountry(country);
  });
  let apiUrlOneCall = `${apiEndpoint}${oneCallApi}lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrlOneCall).then((res) => {
    let { data } = res;
    updateLocationInfo(data);
  });
} // sends user location to the OneCall API

function updateLocationInfo(data) {
  weatherData = data;
  updateTime(data.current.dt);
  updateDate(data.current.dt);
  updateTemp(
    data.current.temp,
    data.current.feels_like,
    data.daily[0].temp.max,
    data.daily[0].temp.min
  );
  updateWeatherDescription(data.current.weather[0].description);
  updateChanceOfRain(data.daily[0].pop);
  updateWindSpeed(data.current.wind_speed);
  updateHumidity(data.current.humidity);
  updateIcon(data.current.weather[0].id);
  displayForecast(data.daily);
  updateUVIndex(data.current.uvi);
} // all functions to run and update the page

function formatDay(unixTime) {
  let date = new Date(unixTime * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = date.getDay();
  return days[day].toUpperCase();
}

function displayForecast(data) {
  let dailyData = data;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  dailyData.forEach(function (dailyData, index) {
    if (index > 0 && index < 7) {
      forecastHTML += `<div class="col-6 col-sm-2">
            <ul>
              <li class="forecast-day">${formatDay(dailyData.dt)}</li>
              <li class="forecast-weather">
                <img
                  src="src/svg/wi-${findIcon(dailyData.weather[0].id)}.svg"
                  alt=""
                  class="forecast-weather-img"
                  width="50px"
                />
              </li>
              <li class="forecast-temp">
                <span class="forecast-low-temp">${Math.round(
                  dailyData.temp.min
                )}</span>°
                <span class="day1-high-temp">${Math.round(
                  dailyData.temp.max
                )}</span>°
              </li>
            </ul>
          </div>`;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function updateTemp(temp, feels, max, min) {
  let currentTemp = document.querySelector("#today-number-temp");
  currentTemp.innerHTML = Math.round(temp);

  let feelsTemp = document.querySelector("#feels-temp");
  let feelsRound = Math.round(feels);
  feelsTemp.innerHTML = `${feelsRound}°`;

  let maxTemp = document.querySelector("#high-temp");
  let maxRound = Math.round(max);
  maxTemp.innerHTML = `${maxRound}°`;

  let minTemp = document.querySelector("#low-temp");
  let minRound = Math.round(min);
  minTemp.innerHTML = `${minRound}°`;
} // updates the temperature of the current city

function updateWeatherDescription(description) {
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = description;
} // updates the current weather description

function updateCity(cityName) {
  let city = document.querySelector("#city");
  city.innerHTML = cityName.toUpperCase();
} // updates the city name

function updateCountry(countryCode) {
  let country = document.querySelector("#country");
  country.innerHTML = countryCode.toUpperCase();
} // updates the country

function updateChanceOfRain(chance) {
  let rain = document.querySelector("#precipitation-percent");
  rain.innerHTML = `${chance * 100}%`;
}

function updateWindSpeed(windSpeedData) {
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${windSpeedData} kmh`;
} // updates the current wind speed

function updateHumidity(humidityData) {
  let humidity = document.querySelector("#humidity-percent");
  humidity.innerHTML = `${humidityData}%`;
} // updates the current humidity

function updateUVIndex(uvi) {
  let uvIndex = document.querySelector("#uv-index");
  if (uvi < 3) {
    uvIndex.innerHTML = "Low";
  } else if (uvi < 6) {
    uvIndex.innerHTML = "Moderate";
  } else if (uvi < 8) {
    uvIndex.innerHTML = "High";
  } else if (uvi < 11) {
    uvIndex.innerHTML = "Very High";
  } else {
    uvIndex.innerHTML = "Extreme";
  }
} //updates the current uv index

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
  todayTemp.innerHTML = Math.round((weatherData.current.temp * 9) / 5 + 32);

  let feelsTemp = document.querySelector("#feels-temp");
  let feelsTempRound = Math.round(
    (weatherData.current.feels_like * 9) / 5 + 32
  );
  feelsTemp.innerHTML = `${feelsTempRound}°`;

  let highTemp = document.querySelector("#high-temp");
  let highTempRound = Math.round((weatherData.daily[0].temp.max * 9) / 5 + 32);
  highTemp.innerHTML = `${highTempRound}°`;

  let lowTemp = document.querySelector("#low-temp");
  let lowTempRound = Math.round((weatherData.daily[0].temp.min * 9) / 5 + 32);
  lowTemp.innerHTML = `${lowTempRound}°`;

  let windSpeed = document.querySelector("#wind-speed");
  let windSpeedRound = weatherData.current.wind_speed / 1.609344;
  windSpeed.innerHTML = `${windSpeedRound.toFixed(2)} mph`;
} // formula to convert celsius to farenheit and change the text

function convertToMetric() {
  let todayTemp = document.querySelector("#today-number-temp");
  todayTemp.innerHTML = Math.round(weatherData.current.temp);

  let feelsTemp = document.querySelector("#feels-temp");
  let feelsTempRound = Math.round(weatherData.current.feels_like);
  feelsTemp.innerHTML = `${feelsTempRound}°`;

  let highTemp = document.querySelector("#high-temp");
  let highTempRound = Math.round(weatherData.daily[0].temp.max);
  highTemp.innerHTML = `${highTempRound}°`;

  let lowTemp = document.querySelector("#low-temp");
  let lowTempRound = Math.round(weatherData.daily[0].temp.min);
  lowTemp.innerHTML = `${lowTempRound}°`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${weatherData.current.wind_speed} kph`;
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
  let currentIcon = document.querySelector("#today-weather-img");
  currentIcon.setAttribute("src", `src/svg/wi-${findIcon(imgID)}.svg`);
}

function findIcon(imgID) {
  let imgName;
  let now = new Date(weatherData.current.dt * 1000);
  let sunrise = new Date(weatherData.current.sunrise * 1000);
  let sunset = new Date(weatherData.current.sunset * 1000);
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
    return imgName;
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
  return imgName;
}
