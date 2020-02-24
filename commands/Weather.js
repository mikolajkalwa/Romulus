const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { darksky, mapbox } = require('../util/request');
const { icon } = require('../util/iconsMap');
const { getWeekday } = require('../util/weekday');
const logger = require('../util/logger');
const PlaceNotFound = require('../exception/PlaceNotFound');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'pogoda',
      enabled: true,
      cooldown: 3600,
      bucket: 3,
      description: 'Wysyła prognozę pogody dla podanej lokalizacji.',
    });
  }

  async fetchGeoData(place) {
    const mapboxResponse = await mapbox.get(`/${encodeURI(place)}.json`);

    if (!mapboxResponse.data.features.length) {
      throw new PlaceNotFound('Nie udało mi się znaleźć takiego miejsca na mapie.');
    }

    const longitude = mapboxResponse.data.features[0].center[0];
    const latitude = mapboxResponse.data.features[0].center[1];
    const address = mapboxResponse.data.features[0].place_name_pl;

    return { longitude, latitude, address };
  }

  async fetchWeatherData({ latitude, longitude }) {
    const darkSkyResponse = await darksky.get(`/${latitude},${longitude}`);
    const weatherData = darkSkyResponse.data;

    return weatherData;
  }

  generateMessageContent(location, weatherData) {
    let summary = '';
    summary += `${icon[weatherData.currently.icon]} ${weatherData.currently.temperature}°C\n`;
    summary += `(${weatherData.currently.summary})\n`;
    summary += weatherData.hourly.summary;

    let currently = '';
    currently += `Temperatura odczuwalna: ${weatherData.currently.apparentTemperature}°C\n`;
    currently += `Szansa opadów: ${Math.round(
      weatherData.currently.precipProbability * 100,
    )}%\n`;
    currently += `Wilgotność powietrza: ${Math.round(
      weatherData.currently.humidity * 100,
    )}%\n`;
    currently += `Prędkość wiatru: ${weatherData.currently.windSpeed} km/h\n`;
    currently += `:arrow_up: :thermometer: ${weatherData.daily.data[0].temperatureMax}°C\n`;
    currently += `:arrow_down: :thermometer: ${weatherData.daily.data[0].temperatureMin}°C`;

    let nextWeek = '';
    weatherData.daily.data.forEach((day) => {
      nextWeek += `${getWeekday(day.time)} - ${icon[day.icon]} ${day.summary}\n`;
    });

    const map = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},7,0,0/350x350?access_token=${process.env.MAPBOX}`;

    const messageEmbed = new MessageEmbed();

    messageEmbed.attachFiles([
      {
        attachment: map,
        name: 'map.png',
      },
    ]);
    messageEmbed.setImage('attachment://map.png');
    messageEmbed.setThumbnail(
      'https://darksky.net/dev/img/attribution/poweredby-darkbackground.png',
    );
    messageEmbed.addField(location.address, summary);
    messageEmbed.addField('Aktualnie', currently);
    messageEmbed.addField('Najbliższe dni', nextWeek);

    return messageEmbed;
  }


  async run(message) {
    if (!message.args.length) {
      return message.reply('Podaj miejsce dla którego sprawdzić pogodę!');
    }
    try {
      const location = await this.fetchGeoData(message.args[0].trim());
      const weather = await this.fetchWeatherData(location);
      const content = this.generateMessageContent(location, weather);
      return message.reply(content);
    } catch (err) {
      if (err instanceof PlaceNotFound) {
        return message.reply('Nie udało mi się znaleźć takiego miejsca na mapie.');
      }
      logger.error(err);
      return message.reply('Coś poszło nie tak!');
    }
  }
};
