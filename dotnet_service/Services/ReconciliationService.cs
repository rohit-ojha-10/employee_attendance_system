using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UnifiedEmployeeSystem.Service.Models;

namespace UnifiedEmployeeSystem.Service.Services
{
    public class ReconciliationService
    {
        private readonly IMongoCollection<Attendance> _attendanceCollection;
        private readonly IMongoCollection<Leave> _leaveCollection;
        private readonly IMongoCollection<Alert> _alertCollection;

        public ReconciliationService(MongoDbService mongoDbService)
        {
            _attendanceCollection = mongoDbService.GetCollection<Attendance>("attendances");
            _leaveCollection = mongoDbService.GetCollection<Leave>("leaves");
            _alertCollection = mongoDbService.GetCollection<Alert>("alerts");
        }

        public async System.Threading.Tasks.Task ReconcileAsync()
        {
            var attendances = await _attendanceCollection.Find(_ => true).ToListAsync();
            var leaves = await _leaveCollection.Find(l => l.Status == "Approved").ToListAsync();

            foreach (var leave in leaves)
            {
                // Check if there is attendance during leave period
                var conflictingAttendance = attendances.FirstOrDefault(a => 
                    a.User == leave.User && 
                    string.Compare(a.Date, leave.StartDate) >= 0 && 
                    string.Compare(a.Date, leave.EndDate) <= 0 &&
                    a.Status == "Present");

                if (conflictingAttendance != null)
                {
                    // Check if alert already exists
                    var existingAlert = await _alertCollection.Find(a => 
                        a.User == leave.User && 
                        a.Type == "RECONCILIATION_MISMATCH" && 
                        !a.IsResolved).FirstOrDefaultAsync();

                    if (existingAlert == null)
                    {
                        var alert = new Alert
                        {
                            User = leave.User,
                            Type = "RECONCILIATION_MISMATCH",
                            Message = $"Mismatch detected: User marked Present on {conflictingAttendance.Date} but has Approved Leave.",
                            IsResolved = false
                        };
                        await _alertCollection.InsertOneAsync(alert);
                    }
                }
            }
        }
    }
}
