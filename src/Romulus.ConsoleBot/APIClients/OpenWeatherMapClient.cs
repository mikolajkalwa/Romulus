using Microsoft.Extensions.Configuration;
using RestSharp;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RestSharp.Serializers.NewtonsoftJson;

namespace Romulus.ConsoleBot.APIClients
{
    class OpenWeatherMapClient : IOpenWeatherMapClient
    {
        private readonly IRestClient _client;
        public OpenWeatherMapClient(IConfiguration config)
        {
            _client = new RestClient(config["OpenWeatherMap:BasicUrl"])
            {
                Authenticator = new ParameterAuthenticator("appid", config["OpenWeatherMap:Token"])
            };
            _client.UseNewtonsoftJson();
        }

        public async Task<OpenWeatherMapResponse> GetWeather(float lat, float lon)
        {
            var request = new RestRequest("/data/2.5/onecall")
                .AddParameter("lang", "pl")
                .AddParameter("units", "metric")
                .AddParameter("exclude", "minutely,hourly,alerts")
                .AddParameter("lat", lat)
                .AddParameter("lon", lon);

            var response = await _client.GetAsync<OpenWeatherMapResponse>(request);
            return response;
        }
    }
}
