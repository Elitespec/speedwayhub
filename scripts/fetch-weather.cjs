const fs = require('fs');
const path = require('path');

// Fallback to manual process.env if dotenv isn't installed
let API_KEY = process.env.VITE_OPENWEATHER_API_KEY;

// Try to load .env manually if API_KEY is missing
if (!API_KEY) {
    try {
        const envPath = path.join(__dirname, '../.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/VITE_OPENWEATHER_API_KEY=(.*)/);
        if (match) API_KEY = match[1].trim();
    } catch (e) {
        console.error('No .env file found or VITE_OPENWEATHER_API_KEY missing');
    }
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY || API_KEY === 'PASTE_YOUR_KEY_HERE') {
    console.error('Error: VITE_OPENWEATHER_API_KEY is missing or not set in .env');
    process.exit(1);
}

const tracksPath = path.join(__dirname, '../src/data/tracks.json');
const outputPath = path.join(__dirname, '../public/weather-data.json');

async function fetchAllWeather() {
    console.log('--- Starting Weather Update ---');

    const tracks = JSON.parse(fs.readFileSync(tracksPath, 'utf8'));
    const results = {};

    for (const track of tracks) {
        if (!track.coords) continue;
        const [lat, lon] = track.coords;

        console.log(`Fetching weather for: ${track.name}...`);

        try {
            // Fetch Current
            const currentRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const currentData = await currentRes.json();

            // Fetch Forecast
            const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const forecastData = await forecastRes.json();

            if (currentData.cod === 200 && forecastData.cod === "200") {
                const dailyForecasts = forecastData.list
                    .filter((_, index) => index % 8 === 0)
                    .slice(1, 4)
                    .map((f) => ({
                        date: new Date(f.dt * 1000).toLocaleDateString('en-NZ', { weekday: 'short' }),
                        temp: Math.round(f.main.temp),
                        description: f.weather[0].description,
                        icon: f.weather[0].icon,
                    }));

                results[track.slug] = {
                    current: {
                        temp: Math.round(currentData.main.temp),
                        description: currentData.weather[0].description,
                        icon: currentData.weather[0].icon,
                    },
                    forecast: dailyForecasts,
                    updatedAt: new Date().toISOString()
                };
            } else {
                console.warn(`  Failed for ${track.name}: ${currentData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`  Error fetching for ${track.name}:`, error.message);
        }

        // Tiny delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Ensure public directory exists
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`--- Finished! Saved to: ${outputPath} ---`);
}

fetchAllWeather();
