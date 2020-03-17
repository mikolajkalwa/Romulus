interface IBasicWeather {
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

interface IWeatherCurrently extends IBasicWeather {
  nearestStormDistance: number;
  nearestStormBearing: number;
  temperature: number;
  apparentTemperature: number;

}

interface IWeatherDaily extends IBasicWeather {
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

export interface IWeather {
  latitude: number;
  longitude: number;
  timezone: string;
  currently: IWeatherCurrently;
  hourly: {
    summary: string;
    icon: string;
    data: IWeatherCurrently[];
  },
  daily: {
    summary: string;
    icon: string;
    data: IWeatherDaily[];
  },
  offset: number;
}
