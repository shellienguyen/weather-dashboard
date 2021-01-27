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

let fetchAndDisplayUvi = function( cityLatLon ) {
   console.log( "fetchAndDisplayUvi fn Lat/Lon: " + cityLatLon );

   let searchLatLon = "lat=" + cityLatLon.lat + "&lon=" + cityLatLon.lon;
   let uviUrl = apiUrl + "onecall?" + searchLatLon + "&appid=" + apiKey;

   // Send search city name to the API to fetch current UVI data
   //    If fetch is a success, parse and display UVI data
   //    If fetch fails, perform error handing
   fetch( uviUrl ). then( function( response ) {
      if( response.ok ) {
         response.json().then( function( fetchedUvi ) {
            console.log();
            console.log( "fetchedUvi: " );
            console.log( fetchedUvi );

            // Dynamically create the <div> to hold the UV info
            let uviData = document.createElement( "div" );
            uviData.textContent = "UV Index: " + ( fetchedUvi.current.uvi );
            weatherBoxBody.appendChild( uviData );
         });
      }
      else {
         console.log( "Fetch UVI error!" );
      };
   });
};

//////////////////////////

let displayCurrentWeather = function( fetchedData ) {
   console.log( "displayCurrentWeather fn" );

   // Dynamically create a <h1> tag to display the city name, date, and weather icon
   let currentWeatherHeader = document.createElement( "h1" );

   // Extract today's date
   let currentTime = moment();
   let today = "(" + currentTime.format( "MM/DD/YYYY" ) + ")";
   console.log( "today: " + today );
   console.log( "fetchedData.name: " + fetchedData.name );

   // Assign the <h1> textcontent to be the city name and today's date
   currentWeatherHeader.textContent = fetchedData.name + " " + today;

   // Dynamically create the <img> element and get the weather icon
   let weatherIcon = document.createElement( "img" )
   weatherIcon.setAttribute( "src", "https://openweathermap.org/img/w/" + fetchedData.weather[ 0 ].icon + ".png" );
   weatherIcon.setAttribute( "alt", fetchedData.weather[ 0 ].main + " - " + fetchedData.weather[ 0 ].description );
   console.log( "ICON" );
   console.log( "src", "https://openweathermap.org/img/w/" + fetchedData.weather[ 0 ].icon + ".png" );
   console.log( "alt", fetchedData.weather[ 0 ].main + " - " + fetchedData.weather[ 0 ].description );

   // Dynamically create the <div> element to display the temperature in
   let currentTemp = document.createElement( "div" );
   currentTemp.textContent = "Temperature: " + ( fetchedData.main.temp ) + " °F";
   console.log( "Temperature: " + ( fetchedData.main.temp ) + " F°" );

   // Dynamically create the <div> element to display the humidity in
   let currentHumidity = document.createElement( "div" );
   currentHumidity.textContent = "Humidity: " + ( fetchedData.main.humidity ) + "%";
   console.log( "Humidity: " + ( fetchedData.main.humidity) + "%" );

   // Dynamically create the <div> element to display the wind speed in
   let currentWindSpeed = document.createElement( "div" );
   currentWindSpeed.textContent = "Wind Speed: " + ( fetchedData.wind.speed ) + "MPH" ;
   console.log( "Wind Speed: " + ( fetchedData.wind.speed ) + "MPH" );

   // Display the UV Index

   // Append the icon to the header
   currentWeatherHeader.appendChild( weatherIcon );

   // Append all the new and dynamically created elements to the weather body box
   weatherBoxBody.appendChild( currentWeatherHeader );
   weatherBoxBody.appendChild( currentTemp );
   weatherBoxBody.appendChild( currentHumidity );
   weatherBoxBody.appendChild( currentWindSpeed );

   currentWeatherBox.appendChild( weatherBoxBody );

   // The current weather box was hidden on page load, remove the "hide" attribute now that we have data to display
   currentWeatherBox.removeAttribute( "class", "hide" );

   // Display the currently fetched UV data
   let cityLatLon = fetchedData.coord;
   fetchAndDisplayUvi( cityLatLon );
};

//////////////////////////

let fetchCurrentWeather = function( searchCity ) {
   console.log( "searchForCurrentWeather fn: " + searchCity );

   let currentWeatherUrl = apiUrl + "weather?q=" + searchCity + "&units=imperial&APPID=" + apiKey;
   console.log( currentWeatherUrl );

   // Send search city name to the API to fetch current weather data
   //    If fetch is a success, call displayCurrentWeather function to parse and display data
   //    if fetch fails, perform error handing
   fetch( currentWeatherUrl ).then( function( response ) {
      if ( response.ok ) {
         response.json().then( function( fetchedData ) {
            console.log( "" );
            console.log( "fetched data: " );
            console.log( fetchedData );

            // Display the currently fetched weather
            displayCurrentWeather( fetchedData );
         });
      }
      else {
         console.log( "Fetch weather data error!" );
         //$( "#no-result-message" ).show();
      };
   });
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
   fetchCurrentWeather( searchCity );
};

//////////////////////////

let addCityToSearchHistory = function( searchCity ) {
   console.log( "addCityToSearchHistory fn: " + searchCity );
};

//////////////////////////

let formSearchHandler = function( event ) {
   /* Prevent the browser from sending the form's input data to a URL
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