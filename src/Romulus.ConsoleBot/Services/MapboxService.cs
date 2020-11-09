using AutoMapper;
using Romulus.ConsoleBot.APIClients;
using Romulus.ConsoleBot.Models;
using System;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public class MapboxService : IMapboxService
    {
        private readonly IMapboxClient _client;
        private readonly IMapper _mapper;

        public MapboxService(IMapboxClient client, IMapper mapper)
        {
            _client = client;
            _mapper = mapper;
        }

        public async Task<Location> GetLocationData(string location)
        {
            var response = await _client.GetLocationData(location);
            if (response.Features.Count == 0)
            {
                throw new ArgumentException("Nie znaleziono takiego miejsca!", location);
            }
            var locationData = _mapper.Map<Location>(response);
            return locationData;
        }

        public async Task<byte[]> GetMapImage(float lat, float lon)
        {
            return await _client.GetMapImage(lat, lon);
        }

    }
}
