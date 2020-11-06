using Discord;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Quartz;
using Romulus.ConsoleBot.Services;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Discord.WebSocket;

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

        //public async Task Execute(IJobExecutionContext context)
        //{
        //    var guild = await _client.GetGuildAsync(Convert.ToUInt64(_configuration["Discord:MainGuild"]));
        //    var allUsers = await guild.GetUsersAsync();
        //    var birthdayRole = guild.GetRole(_birthdayRoleId);
        //    var currentDay = DateTime.Now.ToString("dd-MM");

        //    foreach (var user in allUsers)
        //    {
        //        if (user.RoleIds.Contains(_birthdayRoleId))
        //        {
        //            await user.RemoveRoleAsync(birthdayRole);
        //        }
        //    }

        //    var birthdayUsers = _bitBirthdayService.GetBirthdayUsers(currentDay);
        //    var wishes = new StringBuilder().Append(":partying_face:  Wszystkiego najlepszego z okazji urodzin! ");

        //    foreach (var user in birthdayUsers)
        //    {
        //        var discordUser = allUsers.FirstOrDefault(guildUser => guildUser.Id == user.UserId);
        //        if (discordUser == null)
        //        {
        //            _logger.LogError($"User was not found in guild! UserId: {user.UserId}", user);
        //        }
        //        else
        //        {
        //            wishes.Append("<@").Append(discordUser.Id).Append("> ");
        //            await discordUser.AddRoleAsync(birthdayRole);
        //        }
        //    }

        //    var complimentsChannel =
        //        await guild.GetTextChannelAsync(Convert.ToUInt64(_configuration["Discord:ComplimentsChannel"]));

        //    await complimentsChannel.SendMessageAsync(wishes.ToString());
        //}
        public Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("No elo");
            return Task.CompletedTask;
        }
    }
}
