using Romulus.ConsoleBot.Models;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public interface IWeatherService
    {
        Task<WeatherReport> GenerateWeatherReport(float lat, float lon);
    }
}