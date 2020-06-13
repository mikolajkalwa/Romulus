import got from 'got';
import { URLSearchParams } from 'url';
import config from '../config';

const mapbox = got.extend({
  prefixUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
  responseType: 'json',
  resolveBodyOnly: true,
  searchParams: new URLSearchParams([
    ['access_token', config.MAPBOX],
    ['language', 'pl'],
    ['limit', '1']
  ]),
  hooks: {
    beforeRequest: [
      options => {
        options.url.pathname = `${options.url.pathname}.json`;
      }
    ]
  }
});

const darksky = got.extend({
  prefixUrl: `https://api.darksky.net/forecast/${config.WEATHER}/`,
  responseType: 'json',
  resolveBodyOnly: true,
  searchParams: new URLSearchParams([
    ['lang', 'pl'],
    ['units', 'ca'],
    ['exclude', 'minutely,alerts,flags']
  ])
});

export { mapbox, darksky };
