using RestSharp;
using RestSharp.Authenticators;

namespace Romulus.ConsoleBot.APIClients
{
    class ParameterAuthenticator : IAuthenticator
    {
        private readonly string _parameter;
        private readonly string _key;
        public ParameterAuthenticator(string parameter, string key)
        {
            _parameter = parameter;
            _key = key;
        }
        public void Authenticate(IRestClient client, IRestRequest request)
        {
            request.AddParameter(_parameter, _key);
        }
    }
}
