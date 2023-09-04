const apiKey = '29f0458872de02441230908fa69f365a';

let searchForm = document.getElementById('search-form');
let cityInput = document.getElementById('city-input');
let currentWeather = document.getElementById('current-weather');
let forecast = document.getElementById('forecast');
let searchHistory = document.getElementById('search-history');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let city = cityInput.value;
    if (city) {
        fetchWeather(city);
        addToSearchHistory(city);
    }
    cityInput.value = '';
});

function fetchWeather(city) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let cityName = data.name;
            let date = new Date(data.dt * 1000);
            let temperature = data.main.temp;
            let humidity = data.main.humidity;
            let windSpeed = data.wind.speed;
            let weatherIcon = data.weather[0].icon;

                  
                  let currentWeatherHtml = `
                  <h2>${cityName}</h2>
                  <p>Date: ${date.toLocaleDateString()}</p>
                  <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                  <p>Temperature: ${temperature} &#8451;</p>
                  <p>Humidity: ${humidity}%</p>
                  <p>Wind Speed: ${windSpeed} m/s</p>
              `;
  
              currentWeather.innerHTML = currentWeatherHtml;
  
              fetchFiveDayForecast(city);
          })

        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


function fetchFiveDayForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
           
            let forecasts = data.list;

            
            let forecastHtml = '<h2>5-Day Forecast</h2>';

            forecasts.forEach(forecast => {
              
                let timestamp = forecast.dt * 1000; 
                let date = new Date(timestamp);
                let temperature = forecast.main.temp;
                let humidity = forecast.main.humidity;
                let windSpeed = forecast.wind.speed;
                let weatherIcon = forecast.weather[0].icon;

               
                let formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                });


                let forecastEntryHtml = `
                    <div class="forecast-entry">
                        <p>${formattedDate}</p>
                        <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                        <p>Temperature: ${temperature} &#8451;</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                    </div>
                `;

                forecastHtml += forecastEntryHtml;
            });

            forecast.innerHTML = forecastHtml;
        })
        .catch(error => {
            console.error('Error fetching 5-day forecast data:', error);
        });
}


function addToSearchHistory(city) {
    let historyItem = document.createElement('button');
    historyItem.textContent = city;
    historyItem.addEventListener('click', function () {
        fetchWeather(city);
    });
    searchHistory.appendChild(historyItem);
}
