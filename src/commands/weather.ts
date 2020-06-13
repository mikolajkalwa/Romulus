import got from 'got';
import config from '../config';
import { Message } from 'eris';
import bot from '../bot';
import { darksky, mapbox } from '../miscellaneous/request';

interface Feature {
  center: [number, number];
  // eslint-disable-next-line
  place_name_pl: string; // parameter from api
}

interface MapboxResponse {
  features: Feature[];
}

interface Location {
  longitude: number;
  latitude: number;
  address: string;
}

interface BasicWeather {
  time: number;
  summary: string;
  icon: string;
  precipIntensity: number;
  precipProbability: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  ozone: number;
}

interface WeatherCurrently extends BasicWeather {
  nearestStormDistance: number;
  nearestStormBearing: number;
  temperature: number;
  apparentTemperature: number;

}

interface WeatherDaily extends BasicWeather {
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  precipIntensityMax: number;
  precipIntensityMaxTime: number;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureHighTime: number;
  apparentTemperatureLow: number;
  apparentTemperatureLowTime: number;
  temperatureMin: number;
  temperatureMinTime: number;
  temperatureMax: number;
  temperatureMaxTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;

}

interface Weather {
  latitude: number;
  longitude: number;
  timezone: string;
  currently: WeatherCurrently;
  hourly: {
    summary: string;
    icon: string;
    data: WeatherCurrently[];
  },
  daily: {
    summary: string;
    icon: string;
    data: WeatherDaily[];
  },
  offset: number;
}

const conditionsEmojiMap = new Map([
  ['clear-day', ':sunny:'],
  ['clear-night', ':night_with_stars:'],
  ['rain', ':cloud_rain:'],
  ['snow', ':cloud_snow:'],
  ['sleet', ':cloud_rai,: :cloud_snow:'],
  ['wind', ':dash:'],
  ['fog', ':foggy:'],
  ['cloudy', ':cloud:'],
  ['partly-cloudy-day', ':white_sun_cloud:'],
  ['partly-cloudy-night', ':white_sun_cloud:'],
  ['hail', ':cloud_rain:'],
  ['thunderstorm', ':thunder_cloud_rain:'],
  ['tornado', ':cloud_tornado:']
]);

const getWeekday = (timestampUnix: number) => {
  const tmp = new Date(timestampUnix * 1000);
  const days = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
  return days[tmp.getDay()];
};

const fetchGeoData = async (place: string): Promise<Location | null> => {
  const geolocation = await mapbox.get(encodeURI(place)) as unknown as MapboxResponse;

  if (!geolocation.features.length) {
    return null;
  }

  const longitude = geolocation.features[0].center[0];
  const latitude = geolocation.features[0].center[1];
  const address = geolocation.features[0].place_name_pl;

  return { longitude, latitude, address };
};

const generateWeatherReport = async (location: Location, weatherData: Weather) => {
  let summary = '';
  summary += `${conditionsEmojiMap.get(weatherData.currently.icon)} ${weatherData.currently.temperature}°C\n`;
  summary += `(${weatherData.currently.summary})\n`;
  summary += weatherData.hourly.summary;

  let currently = '';
  currently += `Temperatura odczuwalna: ${weatherData.currently.apparentTemperature}°C\n`;
  currently += `Szansa opadów: ${Math.round(
    weatherData.currently.precipProbability * 100
  )}%\n`;
  currently += `Wilgotność powietrza: ${Math.round(
    weatherData.currently.humidity * 100
  )}%\n`;
  currently += `Prędkość wiatru: ${weatherData.currently.windSpeed} km/h\n`;
  currently += `:arrow_up: :thermometer: ${weatherData.daily.data[0].temperatureMax}°C\n`;
  currently += `:arrow_down: :thermometer: ${weatherData.daily.data[0].temperatureMin}°C`;

  let nextWeek = '';
  weatherData.daily.data.forEach((day) => {
    nextWeek += `${getWeekday(day.time)} - ${conditionsEmojiMap.get(day.icon)} ${day.summary}\n`;
  });

  const mapBuffer = await got(`https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},7,0,0/350x350?access_token=${config.MAPBOX}`).buffer();

  return {
    file: {
      file: mapBuffer,
      name: 'map.png'
    },
    embed: {
      embed: {
        image: {
          url: 'attachment://map.png'
        },
        thumbnail: {
          url: 'https://darksky.net/dev/img/attribution/poweredby-darkbackground.png'
        },
        fields: [
          {
            name: location.address,
            value: summary
          },
          {
            name: 'Aktualnie',
            value: currently
          },
          {
            name: 'Najbliższe dni',
            value: nextWeek
          }
        ]
      }
    }
  };
};

export default {
  label: 'pogoda',
  generator: async (msg: Message, args: Array<string>) => {
    if (!args.length) {
      return 'Podaj miejsce dla którego sprawdzić pogodę!';
    }

    const location = await fetchGeoData(args.join(' '));

    if (!location) {
      return 'Nie udało się znaleźć takiego miejsca na mapie';
    }

    const weather = await darksky.get(`${location.latitude},${location.longitude}`);
    const content = await generateWeatherReport(location, weather as unknown as Weather);
    return bot.createMessage(msg.channel.id, content.embed, content.file);
  },
  options: {
    argsRequired: true,
    cooldown: 600 * 1000,
    cooldownExclusions: {
      userIDs: [config.BOT_OWNER_ID]
    },
    cooldownReturns: 2,
    description: 'Informacje pogodowe z danego regionu',
    errorMessage: 'Coś nie pykło',
    guildOnly: true
  }
};
