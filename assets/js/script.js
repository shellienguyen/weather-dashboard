let searchCityFormId = document.querySelector( "#search-city" );
let searchCityInput = document.querySelector( "#search-city-input" );
let noDataMessage = document.querySelector( "#no-result-message" );
let currentWeatherBox = document.querySelector( "#current-weather-box" );
let forecastBox = document.querySelector( "#forecast-box" );
let weatherBoxBody = document.querySelector( "#weather-box-body" );
let forecastBoxBody = document.querySelector( "#forecast-box-body" );
let searchHistoryList = document.querySelector( "#search-history" );

let searchHistoryArr = [];

let apiKey = "3628922a688c509fc920e765d69eb863";
let apiUrl = "http://api.openweathermap.org/data/2.5/";

//////////////////////////

let showLastCitySearch = function() {
   console.log( "showLastCitySearch fn" );
};

//////////////////////////

let fetchAndDisplayUvi = function( cityLatLon ) {

   let searchLatLon = "lat=" + cityLatLon.lat + "&lon=" + cityLatLon.lon;
   let uviUrl = apiUrl + "onecall?" + searchLatLon + "&appid=" + apiKey;

   /*
   Send search city name to the API to fetch current UVI data
      If fetch is a success, parse and display UVI data
      If fetch fails, perform error handing
   */
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

   // Dynamically create a <h1> tag to display the city name, date, and weather icon
   let currentWeatherHeader = document.createElement( "h1" );

   // Extract today's date
   let currentTime = moment();
   let today = "(" + currentTime.format( "MM/DD/YYYY" ) + ")";

   // Assign the <h1> textcontent to be the city name and today's date
   currentWeatherHeader.textContent = fetchedData.name + " " + today;

   // Dynamically create the <img> element and get the weather icon
   let weatherIcon = document.createElement( "img" )
   weatherIcon.setAttribute( "src", "https://openweathermap.org/img/w/" + fetchedData.weather[ 0 ].icon + ".png" );
   weatherIcon.setAttribute( "alt", fetchedData.weather[ 0 ].main + " - " + fetchedData.weather[ 0 ].description );
  
   // Dynamically create the <div> element to display the temperature in
   let currentTemp = document.createElement( "div" );
   currentTemp.textContent = "Temperature: " + ( fetchedData.main.temp ) + " °F";
  
   // Dynamically create the <div> element to display the humidity in
   let currentHumidity = document.createElement( "div" );
   currentHumidity.textContent = "Humidity: " + ( fetchedData.main.humidity ) + "%";

   // Dynamically create the <div> element to display the wind speed in
   let currentWindSpeed = document.createElement( "div" );
   currentWindSpeed.textContent = "Wind Speed: " + ( fetchedData.wind.speed ) + "MPH" ;
  
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

let fetchAndDisplayCurrentWeather = function( searchCity ) {

   let currentWeatherUrl = apiUrl + "weather?q=" + searchCity + "&units=imperial&APPID=" + apiKey;

   /*
   Send search city name to the API to fetch current weather data
      If fetch is a success, call displayCurrentWeather function to parse and display data
      If fetch fails, perform error handing
   */
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
         document.querySelector( "#current-weather-box" ).classList.remove( "hide" );
         document.querySelector( "#no-result-message" ).classList.remove( "hide" );
      };
   });
};

//////////////////////////

let displayForecastWeather = function( fetchedForecastData ) {

   // Loop through the number of forecast days to display one all 5 forecasts one by one
   for ( let i = 0; i < fetchedForecastData.cnt; i ++) {

      /*
      There is one forecast for every 3 hours, hence 8 forecasts a day
      Grab the daily mid-day forecast and set that to be the daily forecast
      Create all display elements dynamically
      */
      let forecastDate = moment( fetchedForecastData.list[ i ].dt_txt );
      if ( parseInt( forecastDate.format( "HH" )) == 12 ) {

         // Create the <div> box to hold each forecast
         let eachForecastBox = document.createElement( "div" );
         eachForecastBox.classList.add( "card", "bg-primary", "col-10", "col-lg-2", "p-0", "mx-auto", "mt-3" );

         // Create the <div> body to hold each forecast
         let eachForecastBody = document.createElement( "div" );
         eachForecastBody.classList.add( "card-body", "text-light", "p-2" );

         // Forecast header is the forecast date
         let forecastHeader = document.createElement( "h5" );
         forecastHeader.classList.add( "card-title" );
         forecastDate = forecastDate.format( "MM/DD/YYYY" );
         forecastHeader.textContent = forecastDate

         // Grab the weather icon
         let forecastIcon = document.createElement( "img" );
         forecastIcon.setAttribute( "src", "https://openweathermap.org/img/w/" + fetchedForecastData.list[ i ].weather[ 0 ].icon + ".png" );
         forecastIcon.setAttribute( "alt", fetchedForecastData.list[ i ].weather[ 0 ].main + " - " + fetchedForecastData.list[ i ].weather[ 0 ].description );

         // Display the temperature
         let forecastTemp = document.createElement( "div" );
         forecastTemp.textContent = "Temp: " + fetchedForecastData.list[ i ].main.temp + " °F";

         // Display the humidity level
         let forecastHumidity = document.createElement( "div" );
         forecastHumidity.textContent = "Humidity: " + fetchedForecastData.list[ i ].main.humidity + "%";

         // Append all elements to the forecast box body
         eachForecastBody.appendChild( forecastHeader );
         eachForecastBody.appendChild( forecastIcon );
         eachForecastBody.appendChild( forecastTemp );
         eachForecastBody.appendChild( forecastHumidity );

         // Append the forecast box body to the forecast box
         eachForecastBox.appendChild( eachForecastBody );

         // Append each day's forecast box to the 5-day forecast box
         forecastBoxBody.appendChild( eachForecastBox );
      };
   };

   forecastBox.classList.remove( "hide" );
};

//////////////////////////

let fetchAndDisplayFiveDayForecast = function( searchCity ) {

   let forecastUrl = apiUrl + "forecast?q=" + searchCity + "&units=imperial&appid=" + apiKey;

   fetch( forecastUrl ).then( function( response ) {
      if ( response.ok ) {
         response.json().then( function( fetchedForecastData ) {
            console.log( "" );
            console.log( "fetched forecast data: " );
            console.log( fetchedForecastData );

            // Call function to display the 5-Day forecast data
            displayForecastWeather( fetchedForecastData );
         });
      }
      else {
         console.log( "Fetch forecast weather data error!" );
      };
   });
};

//////////////////////////

let weatherSearchHandler = function( searchCity ) {

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

   // Housecleaning done, now call the search function to fetch and display current weather data
   fetchAndDisplayCurrentWeather( searchCity );

   // Call function to fetch and display 5-day forecast
   fetchAndDisplayFiveDayForecast( searchCity );
};

//////////////////////////

let updateHistoryDisplay = function() {

   // Clear the search history display
   searchHistoryList.textContent = ""

   // Grab and parse the searchHistoryArr from localStorage
   searchHistoryArr = JSON.parse( localStorage.getItem( "searchHistory" ));

   /* 
   Display the list of city search history in descending order from the latest
   to the oldest, hence display the array backward, starting from the last item
   in the array up to the first
   */
   let displayCount = 1;
   for ( let i = searchHistoryArr.length -1; i >= 0; i-- ) {
      let historySearchItem = document.createElement( "li" );

      historySearchItem.textContent = displayCount + ".) " + searchHistoryArr[ i ];
      historySearchItem.classList.add( "list-group-item" );
      historySearchItem.setAttribute( "data-history-value", searchHistoryArr[ i ] );

      searchHistoryList.appendChild( historySearchItem );

      displayCount++;
   };
};

//////////////////////////

let addCityToSearchHistory = function( searchCity ) {

   // If city search list avaiable in localStorage, get it
   if ( localStorage.getItem( "searchHistory" )) {
      searchHistoryArr = JSON.parse( localStorage.getItem( "searchHistory" ));
   };

   // Add the recently searched city to the searchHistoryArr array
   searchHistoryArr.push( searchCity );

   console.log( "" );
   console.log( "searchHistoryArr: " + searchHistoryArr );

   // Store up to 10 cities in the searchHistoryArr array, remove the oldest city otherwise
   if (searchHistoryArr.length > 10 ) {
      searchHistoryArr.shift();
   };

   // Store the updated searchHistoryArr into localStorage
   localStorage.setItem( "searchHistory", JSON.stringify( searchHistoryArr ));

   // Refresh the list of search history on the web page
   updateHistoryDisplay();
};

//////////////////////////

let formSearchHandler = function( event ) {
   /*
   Prevent the browser from sending the form's input data to a URL
   as we will handle what happens with the form input data ourselves
   */
   event.preventDefault();

   let searchCity = searchCityInput.value.trim();

   // If the search city is empty
   if( !searchCity ) {
      return false;
   }

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