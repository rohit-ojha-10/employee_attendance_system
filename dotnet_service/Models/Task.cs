using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace UnifiedEmployeeSystem.Service.Models
{
    public class Task
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Title { get; set; }
        
        [BsonRepresentation(BsonType.ObjectId)]
        public string AssignedTo { get; set; }

        public string Status { get; set; }
        public List<TimeLog> TimeLogs { get; set; }
        public double ProductivityScore { get; set; }
    }

    public class TimeLog
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double Duration { get; set; } // in minutes
    }
}
