using System.Threading.Tasks;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Services
{
    public interface IWeatherService
    {
        Task<WeatherReport> GenerateWeatherReport(float lat, float lon);
    }
}