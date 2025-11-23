using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace UnifiedEmployeeSystem.Service.Models
{
    public class Alert
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string User { get; set; }

        public string Type { get; set; }
        public string Message { get; set; }
        public bool IsResolved { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
