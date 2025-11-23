using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace UnifiedEmployeeSystem.Service.Models
{
    [BsonIgnoreExtraElements]
    public class Leave
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("user")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string User { get; set; }

        [BsonElement("leaveType")]
        public string LeaveType { get; set; }

        [BsonElement("startDate")]
        public string StartDate { get; set; }

        [BsonElement("endDate")]
        public string EndDate { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } // Pending, Approved, Rejected
    }
}
