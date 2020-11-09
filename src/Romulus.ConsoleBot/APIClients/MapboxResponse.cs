using Newtonsoft.Json;
using System.Collections.Generic;

namespace Romulus.ConsoleBot.APIClients
{
    public class Feature
    {
        [JsonProperty("place_name_pl")]
        public string PlaceNamePl { get; set; }


        [JsonProperty("center")]
        public List<double> Center { get; set; }
    }
    public class MapboxResponse
    {
        [JsonProperty("features")]
        public List<Feature> Features { get; set; }
    }
}
