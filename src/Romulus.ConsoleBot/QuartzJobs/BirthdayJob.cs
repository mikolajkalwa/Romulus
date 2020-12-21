using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Quartz;
using Romulus.ConsoleBot.Services;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.QuartzJobs
{
    public class BirthdayJob : IJob
    {
        private readonly DiscordSocketClient _client;
        private readonly IConfiguration _configuration;
        private readonly IBirthdayService _birthdayService;
        private readonly ILogger<BirthdayJob> _logger;
        private readonly ulong _birthdayRoleId;
        public BirthdayJob(DiscordSocketClient client, IConfiguration configuration, IBirthdayService birthdayService, ILogger<BirthdayJob> logger)
        {
            _client = client;
            _configuration = configuration;
            _birthdayService = birthdayService;
            _logger = logger;
            _birthdayRoleId = Convert.ToUInt64(_configuration["Discord:BirthdayRole"]);
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("Executing birthday job...");
            var guild = _client.GetGuild(Convert.ToUInt64(_configuration["Discord:MainGuild"]));
            await guild.DownloadUsersAsync();
            _logger.LogDebug("Fetched all guild members...");
            var birthdayRole = guild.GetRole(_birthdayRoleId);
            var currentDay = DateTime.Now.ToString("dd-MM");

            foreach (var user in guild.Users)
            {
                if (user.Roles.Contains(birthdayRole))
                {
                    _logger.LogDebug($"Removing birthday role from {user.Username}");
                    user.RemoveRoleAsync(birthdayRole);
                }
            }

            var birthdayUsers = _birthdayService.GetBirthdayUsers(currentDay).ToList();

            if (!birthdayUsers.Any())
            {
                return;
            }
            _logger.LogDebug($"{birthdayUsers.Count} users have birthday today.");

            var wishes = new StringBuilder(":partying_face:  Wszystkiego najlepszego z okazji urodzin! ");
            var initialLength = wishes.Length;

            foreach (var user in birthdayUsers)
            {
                _logger.LogDebug($"Setting user object for {user.UserId}");
                var discordUser = guild.GetUser(user.UserId);
                if (discordUser == null)
                {
                    _logger.LogError($"User was not found in guild! UserId: {user.UserId}", user);
                    await _birthdayService.ClearBirthday(user.UserId);
                }
                else
                {
                    _logger.LogDebug($"Setting birthday role for {discordUser.Username}");
                    wishes.Append("<@").Append(discordUser.Id).Append("> ");
                    discordUser.AddRoleAsync(birthdayRole);
                }
            }

            if (wishes.Length > initialLength)
            {
                _logger.LogDebug($"Sending message to a compliments channel");
                var complimentsChannel = guild.GetTextChannel(Convert.ToUInt64(_configuration["Discord:ComplimentsChannel"]));
                await complimentsChannel.SendMessageAsync(wishes.ToString());
            }
        }
    }
}
