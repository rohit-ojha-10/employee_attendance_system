using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace UnifiedEmployeeSystem.Service.Models
{
    [BsonIgnoreExtraElements]
    public class Task
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; }
        
        [BsonElement("assignedTo")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string AssignedTo { get; set; }

        [BsonElement("status")]
        public string Status { get; set; }

        [BsonElement("timeLogs")]
        public List<TimeLog> TimeLogs { get; set; }

        [BsonElement("productivityScore")]
        public double ProductivityScore { get; set; }
    }

    public class TimeLog
    {
        [BsonElement("startTime")]
        public DateTime StartTime { get; set; }

        [BsonElement("endTime")]
        public DateTime EndTime { get; set; }

        [BsonElement("duration")]
        public double Duration { get; set; } // in minutes
    }
}
