using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public interface IBirthdayService
    {
        Task SetBirthday(ulong userId, string birthdayDate);
    }
}