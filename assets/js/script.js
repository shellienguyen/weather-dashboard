let searchCityFormId = document.querySelector( "#search-city" );
let searchCityInput = document.querySelector( "#search-city-input" );
let noDataMessage = document.querySelector( "#no-result-message" );
let currentWeatherBox = document.querySelector( "#current-weather-box" );
let forecastBox = document.querySelector( "#forecast-box" );
let weatherBoxBody = document.querySelector( "#weather-box-body" );
let forecastBoxBody = document.querySelector( "#forecast-box-body" );

let apiKey = "3628922a688c509fc920e765d69eb863";
let apiUrl = "http://api.openweathermap.org/data/2.5/";

//////////////////////////

let showLastCitySearch = function() {
   console.log( "showLastCitySearch fn" );
};

//////////////////////////

let searchForCurrentWeather = function( searchCity ) {
   console.log( "searchForCurrentWeather fn: " + searchCity );

   let currentWeatherUrl = apiUrl + "weather?q=" + searchCity + "&units=imperial&APPID=" + apiKey;
   console.log( currentWeatherUrl );
};

//////////////////////////

let weatherSearchHandler = function( searchCity ) {
   console.log( "weatherSearchHandler fn: " + searchCity );

   // Hide the no-data-available message
   noDataMessage.classList.add( "hide" );

   // Hide the current weather box until it is time to display
   currentWeatherBox.classList.add( "hide" );

   // Hide the forecast box until it is time to display
   forecastBox.classList.add( "hide" );

   // Clear the data from the current weather box area
   weatherBoxBody.textContent = "";

   // Clear the data from the forecast box area
   forecastBoxBody.textContent = "";

   // Housecleaning done, now call the search function to fetch data
   searchForCurrentWeather( searchCity );

};

//////////////////////////

let addCityToSearchHistory = function( searchCity ) {
   console.log( "addCityToSearchHistory fn: " + searchCity );
};

//////////////////////////

let formSearchHandler = function( event ) {
   /* Prevetns the browser from sending the form's input data to a URL
      as we will handle what happens with the form input data ourselves */
   event.preventDefault();

   let searchCity = searchCityInput.value.trim();

   // If the search city is empty
   if( !searchCity ) {
      return false;
   }

   console.log( "searchCity: " + searchCity );

   // If there is an input, send it to go fetch weather data
   weatherSearchHandler( searchCity );

   // Clear the input field so the user can perform another search
   searchCityInput.value = "";

   // Add the last searched city to the history search array
   addCityToSearchHistory( searchCity );
};

//////////////////////////

// When the page loads, display the weather data for the last searched city
showLastCitySearch()

// Listen for search submit event, when the user clicks on the search button
searchCityFormId.addEventListener( "click", formSearchHandler );