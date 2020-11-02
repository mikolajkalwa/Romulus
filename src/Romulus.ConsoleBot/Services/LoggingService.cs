using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    class LoggingService
    {
        private readonly DiscordSocketClient _client;
        private readonly CommandService _commands;
        private readonly ILogger<LoggingService> _logger;

        public LoggingService(DiscordSocketClient client, CommandService commands, ILogger<LoggingService> logger)
        {
            _logger = logger;
            _client = client;
            _commands = commands;

            _client.Log += OnLogAsync;
            _commands.Log += OnLogAsync;
        }

        private Task OnLogAsync(LogMessage msg)
        {
            string logText = $": {msg.Exception?.ToString() ?? msg.Message}";

            switch (msg.Severity)
            {
                case LogSeverity.Critical:
                    {
                        _logger.LogCritical(logText);
                        break;
                    }
                case LogSeverity.Warning:
                    {
                        _logger.LogWarning(logText);
                        break;
                    }
                case LogSeverity.Info:
                    {
                        _logger.LogInformation(logText);
                        break;
                    }
                case LogSeverity.Verbose:
                    {
                        _logger.LogInformation(logText);
                        break;
                    }
                case LogSeverity.Debug:
                    {
                        _logger.LogDebug(logText);
                        break;
                    }
                case LogSeverity.Error:
                    {
                        _logger.LogError(logText);
                        break;
                    }
            }

            return Task.CompletedTask;

        }
    }
}
