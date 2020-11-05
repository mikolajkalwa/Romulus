using System.Threading.Tasks;

namespace Romulus.ConsoleBot.APIClients
{
    public interface IMapboxClient
    {
        Task<MapboxResponse> GetLocationData(string place);
        Task<byte[]> GetMapImage(float lat, float lon);
    }
}