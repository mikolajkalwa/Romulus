using Discord;
using Discord.Commands;
using Romulus.ConsoleBot.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Modules
{
    public class WeatherModule : ModuleBase<SocketCommandContext>
    {
        private readonly IMapboxService _mapbox;
        private readonly IWeatherService _weather;

        public WeatherModule(IMapboxService mapbox, IWeatherService weather)
        {
            _mapbox = mapbox;
            _weather = weather;
        }

        [Command("pogoda")]
        public async Task GetWeather([Remainder] string location)
        {
            try
            {
                var locationData = await _mapbox.GetLocationData(location);
                var report = await _weather.GenerateWeatherReport(locationData.Latitude, locationData.Longitude);

                var image = await _mapbox.GetMapImage(locationData.Latitude, locationData.Longitude);
                Stream stream = new MemoryStream(image);

                var embed = new EmbedBuilder
                {
                    ImageUrl = "attachment://image.png"
                };
                embed.AddField(locationData.Address, report.Current);
                embed.AddField("Najbliższe dni", report.Daily);

                await Context.Channel.SendFileAsync(stream, "image.png", embed: embed.Build());
            }
            catch (ArgumentException ex)
            {
                await ReplyAsync(ex.Message);
            }
        }

    }
}
