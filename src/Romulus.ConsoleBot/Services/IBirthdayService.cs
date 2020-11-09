using Romulus.ConsoleBot.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Romulus.ConsoleBot.Services
{
    public interface IBirthdayService
    {
        Task SetBirthday(ulong userId, string birthdayDate);
        IEnumerable<User> GetBirthdayUsers(string birthdayDate);
    }
}