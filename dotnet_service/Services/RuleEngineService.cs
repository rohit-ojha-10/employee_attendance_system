using MongoDB.Driver;
using System.Linq;
using System.Threading.Tasks;
using UnifiedEmployeeSystem.Service.Models;

namespace UnifiedEmployeeSystem.Service.Services
{
    public class RuleEngineService
    {
        private readonly IMongoCollection<Rule> _ruleCollection;
        private readonly IMongoCollection<Attendance> _attendanceCollection;
        private readonly IMongoCollection<Alert> _alertCollection;

        public RuleEngineService(MongoDbService mongoDbService)
        {
            _ruleCollection = mongoDbService.GetCollection<Rule>("rules");
            _attendanceCollection = mongoDbService.GetCollection<Attendance>("attendances");
            _alertCollection = mongoDbService.GetCollection<Alert>("alerts");
        }

        public async System.Threading.Tasks.Task EvaluateRulesAsync()
        {
            var rules = await _ruleCollection.Find(r => r.IsActive).ToListAsync();
            // Get all unique users from attendance (simplified)
            var userIds = await _attendanceCollection.Distinct(a => a.User, _ => true).ToListAsync();

            foreach (var userId in userIds)
            {
                foreach (var rule in rules)
                {
                    if (rule.Condition.StartsWith("ABSENT_COUNT >"))
                    {
                        int threshold = int.Parse(rule.Condition.Split('>')[1].Trim());
                        long absentCount = await _attendanceCollection.CountDocumentsAsync(a => a.User == userId && a.Status == "Absent");

                        if (absentCount > threshold)
                        {
                             // Check if alert already exists
                            var existingAlert = await _alertCollection.Find(a => 
                                a.User == userId && 
                                a.Type == "RULE_VIOLATION" && 
                                a.Message.Contains(rule.Name) &&
                                !a.IsResolved).FirstOrDefaultAsync();

                            if (existingAlert == null)
                            {
                                var alert = new Alert
                                {
                                    User = userId,
                                    Type = "RULE_VIOLATION",
                                    Message = $"Rule Violation: {rule.Name} (Absent count: {absentCount})",
                                    IsResolved = false
                                };
                                await _alertCollection.InsertOneAsync(alert);
                            }
                        }
                    }
                }
            }
        }
    }
}
