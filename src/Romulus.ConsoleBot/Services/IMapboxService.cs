using System.Threading.Tasks;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Services
{
    public interface IMapboxService
    {
        Task<Location> GetLocationData(string location);
        Task<byte[]> GetMapImage(float lat, float lon);
    }
}