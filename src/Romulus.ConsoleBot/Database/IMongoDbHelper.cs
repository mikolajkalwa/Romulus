using MongoDB.Driver;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Database
{
    public interface IMongoDbHelper
    {
        IMongoCollection<User> Users { get; set; }
    }
}