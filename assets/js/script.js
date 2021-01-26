let searchCityFormId = document.querySelector( "#search-city" );
let searchCityInput = document.querySelector( "#search-city-input" );

//////////////////////////

let showLastCitySearch = function() {
   console.log( "showLastCitySearch fn" );
};

//////////////////////////

let weatherSearchHandler = function( searchCity ) {
   console.log( "weatherSearchHandler fn: " + searchCity );
};

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