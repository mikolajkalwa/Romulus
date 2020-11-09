using Romulus.ConsoleBot.Models;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public interface IMapboxService
    {
        Task<Location> GetLocationData(string location);
        Task<byte[]> GetMapImage(float lat, float lon);
    }
}