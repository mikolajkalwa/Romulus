const axios = require('axios');

const darksky = axios.create({
  baseURL: `https://api.darksky.net/forecast/${process.env.WEATHER}`,
});

const mapbox = axios.create({
  baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
});

// https://github.com/axios/axios/issues/1616

darksky.interceptors.request.use((config) => ({
  ...config,
  params: {
    lang: 'pl',
    units: 'ca',
    exclude: ['minutely', 'alerts', 'flags'],
  },
}));

mapbox.interceptors.request.use((config) => ({
  ...config,
  params: {
    access_token: process.env.MAPBOX,
    language: 'pl',
    limit: 1,
  },
}));

module.exports = { darksky, mapbox };
