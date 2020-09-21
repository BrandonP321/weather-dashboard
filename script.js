// create references and variables
var searchInput = $('.city-input')
var searchBtn = $('.submit')
var searchHistoryEle = $('.search-history')
var cityDisplayEle = $('.city-display')
var tempDisplay = $('.temp')
var humidityDisplay = $('.humidity')
var windSpeedDisplay = $('.wind-speed')
var uvDisplay = $('.uv-index')
var forecastBoxEle = $('.forecast-box')
var forecastDayOne = $('.day-one')
var forecastDayTwo = $('.day-two')
var forecastDayThree = $('.day-three')
var forecastDayfour = $('.day-four')
var forecastDayfive = $('.day-five')
var localHistory = [];

function getWeatherData(city) {
    var queryUrl = "http://api.openweathermap.org/data/2.5/weather?appid=3173f26e12fc9bc72e69b1f87efeadd1"
    queryUrl += '&q=' + city

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var cityName = response.name
        var windSpeed = response.wind.speed
        var temp = response.main.temp
        var humidity = response.main.humidity
        var cityLng = response.coord.lon
        var cityLat = response.coord.lat

        cityDisplayEle.text(cityName)
        tempDisplay.text(temp)
        humidityDisplay.text(humidity)
        windSpeedDisplay.text(windSpeed)
        // call function to get uvIndex value
        getUvIndex(cityLng, cityLat)
    })
}

function getUvIndex(lng, lat) {
    var queryUrl = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=3173f26e12fc9bc72e69b1f87efeadd1&cnt=1"
    queryUrl += '&lat=' + lat + '&lon=' + lng
    console.log(queryUrl)
    var uvIndex;

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        uvIndex = response[0].value
        uvDisplay.text(uvIndex)
    })
}

function getForecast(city) {
    var queryUrl = 'http://api.openweathermap.org/data/2.5/forecast?appid=3173f26e12fc9bc72e69b1f87efeadd1&cnt=5'
    queryUrl += '&q=' + city
    console.log(queryUrl)

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response) {
        forecastBoxEle.empty()
        var forecast = response.list
        forecast.forEach(function(day) {
            var temp = day.main.temp
            var humidity = day.main.humidity
            // create div element to append info to
            var newDayELe = $('<div>')
            newDayELe.addClass('forecast-day')
            
            var dateEle = 'nothing yet'
            var tempEle = $('<p>')
            var humidityEle = $('<p>')

            tempEle.text('Temperature: ' + temp)
            humidityEle.text('Humidity: ' + humidity)

            newDayELe.append(dateEle)
            newDayELe.append(tempEle)
            newDayELe.append(humidityEle)

            forecastBoxEle.append(newDayELe)
        })
    })
}


function retrieveStorageList(citySearched) {
    // if 'search history' doesn't exist on user's local storage, create an empty array with that key
    if (!localStorage.getItem('search history')) {
        localStorage.setItem('search history', '[]')
    }

    // store array of user's search history in 'localHistory'
    localHistory = localStorage.getItem('search history')
    localHistory = JSON.parse(localHistory)

    // if the list doesn't include the searched city, add it to the array
    if (!localHistory.includes(citySearched) && citySearched) {
        localHistory.unshift(citySearched)
    }

    searchHistoryEle.empty();
    // for each search, create a button and append it to the page
    localHistory.forEach(function (city) {
        var cityBtn = $('<button>')
        cityBtn.attr('class', 'city-history-btn')
        cityBtn.attr('value', city)
        cityBtn.text(city)
        // if adding the next city causes the history length to go over 5, pop the last city
        if (localHistory.length > 5) {
            localHistory.pop()
        }
        // append the current city btn to the page
        searchHistoryEle.append(cityBtn)
    })

    // stringify the array and send it back to storage
    localHistory = JSON.stringify(localHistory)
    localStorage.setItem('search history', localHistory)

    $('.city-history-btn').on('click', function (event) {
        var cityToSearch = $(this).val()
        getWeatherData(cityToSearch)
        getForecast(cityToSearch)
    })
}

// fire when user clicks to search for a city
searchBtn.on('click', function (event) {
    event.preventDefault()
    // retrive the city from the input element
    var cityToSearch = searchInput.val()
    // pull user's search history from storage for creating buttons
    retrieveStorageList(cityToSearch)
    // get the weather data for that city
    getWeatherData(cityToSearch);
    // set the search bar to blank
    searchInput.val('')
})


// retrieve any search history already stored on user's computer
retrieveStorageList();
