using System.Collections.Generic;
using System.Threading.Tasks;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Services
{
    public interface IBirthdayService
    {
        Task SetBirthday(ulong userId, string birthdayDate);
        IEnumerable<User> GetBirthdayUsers(string birthdayDate);
    }
}