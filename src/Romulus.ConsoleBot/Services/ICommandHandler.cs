using Discord.WebSocket;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public interface ICommandHandler
    {
        Task HandleCommandAsync(SocketMessage msg);
    }
}