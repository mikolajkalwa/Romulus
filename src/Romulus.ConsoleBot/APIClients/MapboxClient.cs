using Microsoft.Extensions.Configuration;
using RestSharp;
using RestSharp.Serializers.NewtonsoftJson;
using System;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.APIClients
{
    public class MapboxClient : IMapboxClient
    {
        private readonly IRestClient _client;
        public MapboxClient(IConfiguration config)
        {
            _client = new RestClient(config["Mapbox:BasicUrl"])
            {
                Authenticator = new ParameterAuthenticator("access_token", config["Mapbox:Token"])
            };
            _client.UseNewtonsoftJson();
        }

        public async Task<MapboxResponse> GetLocationData(string place)
        {
            var request = new RestRequest($"geocoding/v5/mapbox.places/{Uri.EscapeUriString(place)}.json")
                .AddParameter("language", "pl")
                .AddParameter("limit", "1");
            var response = await _client.GetAsync<MapboxResponse>(request);
            return response;
        }

        public async Task<byte[]> GetMapImage(float lat, float lon)
        {
            var request =
                new RestRequest(
                    $"styles/v1/mapbox/dark-v10/static/pin-s({lon},{lat})/{lon},{lat},7,0,0/350x350");

            var response = await _client.ExecuteAsync(request);
            return response.RawBytes;
        }
    }
}
