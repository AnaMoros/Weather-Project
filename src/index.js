// Weather buttons
let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", handleSearchSubmit); // search bar and button

let currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", findLocation); // current location

let degreeButton = document.querySelector("#degree-button");
degreeButton.addEventListener("click", convertTemp); //change between C and F

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
  //updateUVIndex(); --CURRENTLY NO UV DATA BEING RECIEVED --!!
} // all functions to run and update the page

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
  windSpeed.innerHTML = `${windSpeedData} kph`;
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
    convertToF();
    swapToCButton();
  } else {
    convertToC();
    swapToFButton();
  }
} // ChangeS the temperature buttons when pressed

function convertToF() {
  let todayTemp = document.querySelector("#today-number-temp");
  todayTemp.innerHTML = Math.round((todayTemp.innerHTML * 9) / 5 + 32);
} // formula to convert celsius to farenheit and change the text

function convertToC() {
  let todayTemp = document.querySelector("#today-number-temp");
  todayTemp.innerHTML = Math.round((todayTemp.innerHTML - 32) * (5 / 9));
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
