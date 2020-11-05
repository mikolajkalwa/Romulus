using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Romulus.ConsoleBot.Models;

namespace Romulus.ConsoleBot.Database
{
    public class MongoDbHelper : IMongoDbHelper
    {
        public IMongoCollection<User> Users { get; set; }

        public MongoDbHelper(IConfiguration config)
        {
            IMongoClient client = new MongoClient(config["MongoDB:ConnectionString"]);
            var db = client.GetDatabase(config["MongoDB:Database"]);
            Users = db.GetCollection<User>(config["MongoDB:UsersCollection"]);
        }
    }
}
