using Newtonsoft.Json;
using System.Collections.Generic;

namespace Romulus.ConsoleBot.APIClients
{
    public class Currently
	{
        [JsonProperty("temp")]
		public float Temperature { get; set; }

		[JsonProperty("feels_like")]
		public float ApparentTemperature { get; set; }

        [JsonProperty("humidity")]
		public int Humidity { get; set; }

        [JsonProperty("wind_speed")]
		public float WindSpeed { get; set; }

        [JsonProperty("weather")]
		public List<WeatherForecast> WeatherForecast { get; set; }
	}

	public class WeatherForecast
	{
		[JsonProperty("icon")]
		public string Icon { get; set; }

        [JsonProperty("description")]
		public string Description { get; set; }
    }

	public class DailyForecast
	{
        [JsonProperty("dt")]
		public int DayTime { get; set; }

        [JsonProperty("weather")]
		public List<WeatherForecast> WeatherForecast { get; set; }

	}
	public class OpenWeatherMapResponse
    {
        [JsonProperty("current")]
        public Currently Currently { get; set; }

        [JsonProperty("daily")]
        public List<DailyForecast> DailyForecast { get; set; }
	}
}
