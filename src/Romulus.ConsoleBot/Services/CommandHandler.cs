using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public class CommandHandler : ICommandHandler
    {
        private readonly DiscordSocketClient _client;
        private readonly CommandService _commands;
        private readonly IServiceProvider _services;
        private readonly IConfiguration _config;

        public CommandHandler(IServiceProvider services, CommandService commands, DiscordSocketClient client, IConfiguration config)
        {
            _commands = commands;
            _client = client;
            _services = services;
            _config = config;
        }

        public async Task InitializeAsync()
        {
            await _commands.AddModulesAsync(
                assembly: Assembly.GetEntryAssembly(),
                services: _services);
            _client.MessageReceived += HandleCommandAsync;
        }

        public async Task HandleCommandAsync(SocketMessage msg)
        {
            var message = msg as SocketUserMessage;
            if (message == null) return;

            int argPos = 0;

            if (!(message.HasStringPrefix(_config["Discord:Prefix"], ref argPos) ||
                message.HasMentionPrefix(_client.CurrentUser, ref argPos)) ||
                message.Author.IsBot)
                return;

            var context = new SocketCommandContext(_client, message);

            var result = await _commands.ExecuteAsync(
                context: context,
                argPos: argPos,
                services: _services);

            if (!result.IsSuccess)
            {
                await context.Channel.SendMessageAsync(result.ToString());
            }
        }
    }
}
