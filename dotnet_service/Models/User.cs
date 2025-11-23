using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UnifiedEmployeeSystem.Service.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("role")]
        public string Role { get; set; }
    }
}
