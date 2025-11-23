using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace UnifiedEmployeeSystem.Service.Models
{
    [BsonIgnoreExtraElements]
    public class Alert
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("user")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string User { get; set; }

        [BsonElement("type")]
        public string Type { get; set; }

        [BsonElement("message")]
        public string Message { get; set; }

        [BsonElement("isResolved")]
        public bool IsResolved { get; set; }

        [BsonElement("generatedAt")]
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
