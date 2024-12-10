const apiKey = '483717c02266a907898499d2bd5f20b4'; 

document.getElementById('search-btn').addEventListener('click', async () => {
    const cityInput = document.getElementById('city-input').value.trim();
    const city = encodeURIComponent(cityInput);
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading');

    errorMessage.textContent = ''; 
    loadingMessage.textContent = '';

    if (!city) {
        errorMessage.textContent = 'Please enter a city name.';
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`;

    try {
        loadingMessage.textContent = 'Loading...';
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your key.');
            } else if (response.status === 404) {
                throw new Error('City not found. Please check the city name.');
            } else {
                throw new Error('An unexpected error occurred. Please try again later.');
            }
        }

        const data = await response.json();

        displayWeather(data);
        displayForecast(data);

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loadingMessage.textContent = ''; 
    }
});

document.getElementById('city-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.city.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.list[0].main.temp}°C`;
    document.getElementById('description').textContent = `Weather: ${data.list[0].weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.list[0].main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.list[0].wind.speed} m/s`;

    document.getElementById('weather-info').classList.remove('hidden');
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; 

    const currentDate = new Date();

    let daysDisplayed = 0;
    let i = 0; 

    while (daysDisplayed < 3 && i < data.list.length) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000);

        if (date.getDate() !== currentDate.getDate() || daysDisplayed > 0) {
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h3>${day}</h3>
                <p>Temperature: ${dayData.main.temp}°C</p>
                <p>Weather: ${dayData.weather[0].description}</p>
                <p>Humidity: ${dayData.main.humidity}%</p>
                <p>Wind Speed: ${dayData.wind.speed} m/s</p>
            `;
            forecastContainer.appendChild(forecastItem);

            daysDisplayed++;
        }

        i += 8; 
    }
}
