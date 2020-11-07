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
        private readonly IBirthdayService _bitBirthdayService;
        private readonly ILogger<BirthdayJob> _logger;
        private readonly ulong _birthdayRoleId;
        public BirthdayJob(DiscordSocketClient client, IConfiguration configuration, IBirthdayService bitBirthdayService, ILogger<BirthdayJob> logger)
        {
            _client = client;
            _configuration = configuration;
            _bitBirthdayService = bitBirthdayService;
            _logger = logger;
            _birthdayRoleId = Convert.ToUInt64(_configuration["Discord:BirthdayRole"]);
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var guild = _client.GetGuild(Convert.ToUInt64(_configuration["Discord:MainGuild"]));
            var birthdayRole = guild.GetRole(_birthdayRoleId);
            var currentDay = DateTime.Now.ToString("dd-MM");

            foreach (var user in guild.Users)
            {
                if (user.Roles.Contains(birthdayRole))
                {
                    user.RemoveRoleAsync(birthdayRole);
                }
            }

            var birthdayUsers = _bitBirthdayService.GetBirthdayUsers(currentDay).ToList();

            if (!birthdayUsers.Any())
            {
                return;
            }

            var wishes = new StringBuilder().Append(":partying_face:  Wszystkiego najlepszego z okazji urodzin! ");

            foreach (var user in birthdayUsers)
            {
                var discordUser = guild.Users.FirstOrDefault(guildUser => guildUser.Id == user.UserId);
                if (discordUser == null)
                {
                    _logger.LogError($"User was not found in guild! UserId: {user.UserId}", user);
                }
                else
                {
                    wishes.Append("<@").Append(discordUser.Id).Append("> ");
                    discordUser.AddRoleAsync(birthdayRole);
                }
            }

            var complimentsChannel = guild.GetTextChannel(Convert.ToUInt64(_configuration["Discord:ComplimentsChannel"]));

            await complimentsChannel.SendMessageAsync(wishes.ToString());
        }
    }
}
