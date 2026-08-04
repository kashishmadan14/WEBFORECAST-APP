<<<<<<< HEAD
#MERN Weather Forecast Application

A full-stack weather forecast app. Search any city and get real-time
temperature, humidity, wind speed, "feels like" temperature, and
conditions. Built with MongoDB, Express, React, and Node.js.

```
weather-app/
├── backend/     Express + Mongoose REST API (talks to OpenWeatherMap)
└── frontend/    React (Vite) UI
```

## How it works

1. The user types a city into the React frontend and submits the form.
2. The frontend calls the backend at `GET /api/weather?city=...&units=...`
   using Axios — it never talks to OpenWeatherMap directly, and never
   sees the API key.
3. The Express backend validates the request, calls the OpenWeatherMap
   API using a key stored in `.env`, trims the response down to only
   what the UI needs, and returns it as JSON.
4. Each successful lookup is saved to MongoDB (city, country, temp,
   condition, timestamp) so the UI can show "recent searches."
5. The frontend renders the result, or a friendly error / loading state.

## Prerequisites

- Node.js 18+
- npm
- A MongoDB instance (local install, or a free MongoDB Atlas cluster)
- A free API key from https://openweathermap.org/api

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weather_app
OPENWEATHER_API_KEY=your_real_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
CLIENT_ORIGIN=http://localhost:5173
```

Run it:

```bash
npm run dev        # with nodemon, auto-restarts on change
# or
npm start
```

Check it's alive: open http://localhost:5000/api/health — you should
see `{"status":"ok", ...}`.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## API reference

### `GET /api/weather?city=<name>&units=metric|imperial`

Returns current weather for a city.

```json
{
  "city": "London",
  "country": "GB",
  "temperature": 18,
  "feelsLike": 17,
  "humidity": 63,
  "windSpeed": 4.1,
  "condition": "Clouds",
  "description": "scattered clouds",
  "pressure": 1014,
  "visibility": 10000,
  "sunrise": 1719900000,
  "sunset": 1719955000,
  "fetchedAt": "2026-08-04T09:00:00.000Z"
}
```

Errors: `400` (missing/invalid input), `404` (city not found),
`500` (server/config issue), `504` (upstream timeout).

### `GET /api/weather/history?limit=5`

Returns the most recent searches, most recent first.

```json
[
  { "city": "London", "country": "GB", "temperature": 18, "condition": "Clouds", "searchedAt": "..." }
]
```



