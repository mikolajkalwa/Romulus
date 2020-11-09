using AutoMapper;
using Romulus.ConsoleBot.APIClients;
using Romulus.ConsoleBot.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Romulus.ConsoleBot
{
    public class AutoMapping : Profile
    {

        private static readonly Dictionary<string, string> Icons = new Dictionary<string, string>()
        {
            // map icon code to emoji https://openweathermap.org/weather-conditions#Icon-list
            {"01", ":sunny:"},
            {"02", ":white_sun_cloud:"},
            {"03", ":cloud:"},
            {"04", ":cloud:"},
            {"09", ":cloud_rain:"},
            {"10", ":white_sun_rain_cloud:"},
            {"11", ":thunder_cloud_rain:"},
            {"13", ":cloud_snow:"},
            {"50", ":fog:"}
        };

        public AutoMapping()
        {
            CreateMap<OpenWeatherMapResponse, Weather>()
                .ForMember(
                    dest => dest.CurrentWeather,
                    opt => opt.MapFrom((src, dest) =>
                    {

                        var icon = src.Currently.WeatherForecast.First().Icon;
                        icon = icon.Remove(icon.Length - 1);
                        Icons.TryGetValue(icon, out string emojiValue);

                        return new CurrentWeather
                        {
                            Icon = emojiValue,
                            Temeparture = src.Currently.Temperature,
                            ApparentTemperature = src.Currently.ApparentTemperature,
                            Humidity = src.Currently.Humidity,
                            Summary = src.Currently.WeatherForecast.First().Description
                        };

                    })
                )
                .ForMember(
                  dest => dest.DailyWeather,
                  opt => opt.MapFrom((src, dest) =>
                  {
                      var daily = new List<DailyWeather>();
                      foreach (var dailyForecast in src.DailyForecast)
                      {
                          var icon = dailyForecast.WeatherForecast.First().Icon;
                          icon = icon.Remove(icon.Length - 1);
                          Icons.TryGetValue(icon, out string emojiValue);

                          var date = DateTimeOffset.FromUnixTimeSeconds(dailyForecast.DayTime);
                          var weekday = date.ToString("dddd", new CultureInfo("PL"));

                          var summary = dailyForecast.WeatherForecast.First().Description;

                          daily.Add(new DailyWeather
                          {
                              Icon = emojiValue,
                              Weekday = weekday,
                              Summary = summary
                          });
                      }

                      return daily;
                  })
                    );

            CreateMap<MapboxResponse, Location>()
                .ForMember(
                    dest => dest.Longitude,
                    opt => opt.MapFrom(src => src.Features.First().Center[0])
                )
                .ForMember(
                    dest => dest.Latitude,
                    opt => opt.MapFrom(src => src.Features.First().Center[1])
                )
                .ForMember(
                    dest => dest.Address,
                    opt => opt.MapFrom(src => src.Features.First().PlaceNamePl)
                );

        }
    }
}