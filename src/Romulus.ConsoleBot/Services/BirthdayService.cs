using MongoDB.Driver;
using Romulus.ConsoleBot.Database;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Services
{
    public class BirthdayService : IBirthdayService
    {
        private readonly IMongoDbHelper _database;
        private static readonly Regex BirthdayRegex = new Regex("^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$", RegexOptions.Compiled);

        public BirthdayService(IMongoDbHelper database)
        {
            _database = database;
        }
        public async Task SetBirthday(ulong userId, string birthdayDate)
        {
            if (!BirthdayRegex.IsMatch(birthdayDate))
            {
                throw new ArgumentException("Podano  datę w nieprawidłowym formacie.", birthdayDate);
            }

            var userQuery = _database.Users.Find(x => x.UserId == userId).ToEnumerable().ToList();

            if (userQuery.Any())
            {
                var user = userQuery.First();

                // don't allow users to modify birthday date if they set it in the past
                if (user.Birthday != null)
                {
                    throw new InvalidOperationException("Użytkownik już posiada ustawioną datę urodzin.");
                }

                var update = Builders<User>.Update.Set(x => x.Birthday, birthdayDate);
                await _database.Users.UpdateOneAsync(x => x.UserId == userId, update);
            }
            else
            {
                var user = new User
                {
                    Birthday = birthdayDate,
                    UserId = userId
                };

                await _database.Users.InsertOneAsync(user);
            }
        }
    }
}
