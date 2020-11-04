using AutoMapper;
using Romulus.ConsoleBot.APIClients;
using Romulus.ConsoleBot.Models;
using System.Text;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly IOpenWeatherMapClient _weatherClient;
        private readonly IMapper _mapper;

        public WeatherService(IOpenWeatherMapClient weatherClient, IMapper mapper)
        {
            _weatherClient = weatherClient;
            _mapper = mapper;
        }

        public async Task<WeatherReport> GenerateWeatherReport(float lat, float lon)
        {
            var response = await _weatherClient.GetWeather(lat, lon);
            var weatherForecast = _mapper.Map<Weather>(response);

            var current = new StringBuilder();
            current.Append(weatherForecast.CurrentWeather.Icon).Append(' ')
                .Append(weatherForecast.CurrentWeather.Temeparture).AppendLine("°C");
            current.AppendLine(weatherForecast.CurrentWeather.Summary);
            current.Append("Temperatura odczuwalna: ").Append(weatherForecast.CurrentWeather.ApparentTemperature)
                .AppendLine("°C");
            current.Append("Wilgotność powietrza: ").Append(weatherForecast.CurrentWeather.Humidity).AppendLine("%");

            var daily = new StringBuilder();
            foreach (var dailyWeather in weatherForecast.DailyWeather)
            {
                daily.Append(dailyWeather.Weekday).Append(" - ").Append(dailyWeather.Icon).Append(" ")
                    .AppendLine(dailyWeather.Summary);
            }

            return new WeatherReport
            {
                Current = current.ToString(),
                Daily = daily.ToString()
            };
        }

    }
}
