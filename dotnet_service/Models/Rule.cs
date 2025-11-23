using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UnifiedEmployeeSystem.Service.Models
{
    public class Rule
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }
        public string Condition { get; set; }
        public string Action { get; set; }
        public bool IsActive { get; set; }
    }
}
