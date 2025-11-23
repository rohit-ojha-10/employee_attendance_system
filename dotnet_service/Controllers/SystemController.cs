using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UnifiedEmployeeSystem.Service.Services;

namespace UnifiedEmployeeSystem.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly ReconciliationService _reconciliationService;
        private readonly ProductivityService _productivityService;
        private readonly RuleEngineService _ruleEngineService;

        public SystemController(
            ReconciliationService reconciliationService,
            ProductivityService productivityService,
            RuleEngineService ruleEngineService)
        {
            _reconciliationService = reconciliationService;
            _productivityService = productivityService;
            _ruleEngineService = ruleEngineService;
        }

        [HttpPost("reconcile")]
        public async Task<IActionResult> Reconcile()
        {
            await _reconciliationService.ReconcileAsync();
            return Ok(new { message = "Reconciliation completed" });
        }

        [HttpPost("calculate-productivity")]
        public async Task<IActionResult> CalculateProductivity()
        {
            await _productivityService.CalculateProductivityAsync();
            return Ok(new { message = "Productivity calculation completed" });
        }

        [HttpPost("evaluate-rules")]
        public async Task<IActionResult> EvaluateRules()
        {
            await _ruleEngineService.EvaluateRulesAsync();
            return Ok(new { message = "Rule evaluation completed" });
        }
        
        [HttpPost("run-all")]
        public async Task<IActionResult> RunAll()
        {
             await _reconciliationService.ReconcileAsync();
             await _productivityService.CalculateProductivityAsync();
             await _ruleEngineService.EvaluateRulesAsync();
             return Ok(new { message = "All system checks completed" });
        }
    }
}
