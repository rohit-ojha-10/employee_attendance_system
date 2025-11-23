using MongoDB.Driver;
using System.Linq;
using System.Threading.Tasks;
using UnifiedEmployeeSystem.Service.Models;

namespace UnifiedEmployeeSystem.Service.Services
{
    public class ProductivityService
    {
        private readonly IMongoCollection<Models.Task> _taskCollection;

        public ProductivityService(MongoDbService mongoDbService)
        {
            _taskCollection = mongoDbService.GetCollection<Models.Task>("tasks");
        }

        public async System.Threading.Tasks.Task CalculateProductivityAsync()
        {
            var tasks = await _taskCollection.Find(t => t.Status == "Completed").ToListAsync();

            foreach (var task in tasks)
            {
                if (task.TimeLogs != null && task.TimeLogs.Any())
                {
                    double totalDuration = task.TimeLogs.Sum(t => t.Duration); // in minutes
                    
                    // Simple score calculation: 10 points per hour, max 100
                    double score = (totalDuration / 60) * 10;
                    if (score > 100) score = 100;

                    var update = Builders<Models.Task>.Update.Set(t => t.ProductivityScore, score);
                    await _taskCollection.UpdateOneAsync(t => t.Id == task.Id, update);
                }
            }
        }
    }
}
