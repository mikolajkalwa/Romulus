using MongoDB.Driver;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Database
{
    public interface IMongo
    {
        IMongoCollection<User> Users { get; set; }
    }
}