/* eslint-disable quote-props */
const conditions = new Map([
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
  ['tornado', ':cloud_tornado:'],
]);


const moonPhase = new Map([
  ['0', ':new_moon:'],
  ['0.25', ':first_quarter_moon:'],
  ['0.5', ':full_moon:'],
  ['0.75', ':last_quarter_moon:'],
]);

export { conditions, moonPhase };
