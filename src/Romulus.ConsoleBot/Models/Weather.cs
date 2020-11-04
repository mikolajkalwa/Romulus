namespace Romulus.ConsoleBot.Models
{
    public class CurrentWeather
    {
        public string Icon { get; set; }
        public float Temeparture { get; set; }
        public float ApparentTemperature { get; set; }
        public string Summary { get; set; }
        public int Humidity { get; set; }
    }

    public class DailyWeather
    {
        public string Weekday { get; set; }
        public string Icon { get; set; }
        public string Summary { get; set; }
    }

    public class Weather
    {
        public CurrentWeather CurrentWeather { get; set; }
        public DailyWeather[] DailyWeather { get; set; }
    }
}
