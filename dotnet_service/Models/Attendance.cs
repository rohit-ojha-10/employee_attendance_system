using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace UnifiedEmployeeSystem.Service.Models
{
    [BsonIgnoreExtraElements]
    public class Attendance
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("user")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string User { get; set; }

        [BsonElement("date")]
        public string Date { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } // Present, Absent

        [BsonElement("checkIn")]
        public DateTime? CheckInTime { get; set; }

        [BsonElement("checkOut")]
        public DateTime? CheckOutTime { get; set; }
    }
}
