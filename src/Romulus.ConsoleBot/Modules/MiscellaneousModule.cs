using Discord.Commands;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Modules
{
    public class MiscellaneousModule : ModuleBase<SocketCommandContext>
    {
        [Command("ping")]
        public async Task Ping()
        {
            await ReplyAsync("Pong!");
        }
    }
}
