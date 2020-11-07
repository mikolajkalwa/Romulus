using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Romulus.ConsoleBot.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public ObjectId ObjectId { get; set; }

        // to keep compatibility with previous version of the bot, store user id as string
        [BsonRepresentation(BsonType.String)]
        [BsonElement("id")]
        public ulong UserId { get; set; }

        [BsonElement("birthday")]
        public string Birthday { get; set; }
    }
}
