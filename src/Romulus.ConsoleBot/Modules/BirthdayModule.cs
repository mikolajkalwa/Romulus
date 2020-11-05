using System;
using System.Threading.Tasks;
using Discord.Commands;
using Microsoft.Extensions.Logging;
using Romulus.ConsoleBot.Services;

namespace Romulus.ConsoleBot.Modules
{
    public class BirthdayModule : ModuleBase<SocketCommandContext>
    {
        private readonly IBirthdayService _birthdayService;
        private readonly ILogger<BirthdayModule> _logger;

        public BirthdayModule(IBirthdayService birthdayService, ILogger<BirthdayModule> logger)
        {
            _birthdayService = birthdayService;
            _logger = logger;
        }

        [Command("urodziny")]
        [Summary("Ustawia dzień urodzin. W dniu urodzin użytkownik dostaje specjalną rangę - solenizant. Data jest w formacie DD-MM. Na przykład: 11-01 oznacza 11 stycznia. Datę urodzin można ustawić tylko raz, nie można jej później zmienić!")]

        public async Task SetBirthday(string date)
        {
            try
            {
                await _birthdayService.SetBirthday(Context.Client.CurrentUser.Id, date);
                await ReplyAsync("Prawidłowo ustawiono datę urodzin!");
            }
            catch (ArgumentException ex)
            {
                await ReplyAsync(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                await ReplyAsync(ex.Message);
            }
            catch (Exception ex)
            {
                await ReplyAsync("Coś poszło nie tak.");
                _logger.LogError(ex, "Something went wrong during birthday setting.");
            }
        }
    }
}
