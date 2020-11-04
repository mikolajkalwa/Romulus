using System.Threading.Tasks;

namespace Romulus.ConsoleBot.APIClients
{
    public interface IOpenWeatherMapClient
    {
        Task<OpenWeatherMapResponse> GetWeather(float lat, float lon);
    }
}