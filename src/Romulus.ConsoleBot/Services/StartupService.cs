using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public class StartupService : IStartupService
    {
        private readonly IServiceProvider _services;
        private readonly DiscordSocketClient _client;
        private readonly CommandService _commands;
        private readonly IConfiguration _config;

        public StartupService(IServiceProvider services, DiscordSocketClient client, CommandService commands, IConfiguration config)
        {
            _services = services;
            _config = config;
            _client = client;
            _commands = commands;
        }

        public async Task StartAsync()
        {
            string discordToken = _config["Discord:Token"];
            if (string.IsNullOrWhiteSpace(discordToken))
                throw new Exception("Please enter your bot's token into the `appsettings.json` file found in the applications root directory.");

            await _client.LoginAsync(TokenType.Bot, discordToken);
            await _client.StartAsync();
            await _commands.AddModulesAsync(Assembly.GetEntryAssembly(), _services);
        }

    }
}
