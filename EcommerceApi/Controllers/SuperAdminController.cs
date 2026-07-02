using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuperAdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public SuperAdminController(AppDbContext db) => _db = db;

    // GET: api/superadmin/dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var totalUsers = await _db.Users.CountAsync();
        var totalVendors = await _db.VendorProfiles.CountAsync();
        var totalWholesalers = await _db.WholesalerProfiles.CountAsync();
        var totalProducts = await _db.Products.CountAsync();
        var totalOrders = await _db.Orders.CountAsync();
        var totalRevenue = await _db.Orders.SumAsync(o => o.Total);
        var pendingVendors = await _db.VendorProfiles.CountAsync(v => v.Status == "pending");
        var pendingWholesalers = await _db.WholesalerProfiles.CountAsync(w => w.Status == "pending");

        return Ok(new
        {
            totalUsers,
            totalVendors,
            totalWholesalers,
            totalProducts,
            totalOrders,
            totalRevenue,
            pendingVendors,
            pendingWholesalers
        });
    }

    // GET: api/superadmin/organizations
    [HttpGet("organizations")]
    public async Task<IActionResult> GetOrganizations()
    {
        var vendors = await _db.VendorProfiles
            .Include(v => v.User)
            .Select(v => new { Type = "vendor", v.Id, v.BusinessName, v.Status, v.CreatedAt })
            .ToListAsync();

        var wholesalers = await _db.WholesalerProfiles
            .Include(w => w.User)
            .Select(w => new { Type = "wholesaler", w.Id, w.BusinessName, w.Status, w.CreatedAt })
            .ToListAsync();

        var all = vendors.Cast<object>().Concat(wholesalers.Cast<object>()).ToList();
        return Ok(all);
    }

    // GET: api/superadmin/feature-flags
    [HttpGet("feature-flags")]
    public async Task<IActionResult> GetFeatureFlags()
    {
        var flags = await _db.FeatureFlags.ToListAsync();
        return Ok(flags);
    }

    // PUT: api/superadmin/feature-flags/{id}
    [HttpPut("feature-flags/{id}")]
    public async Task<IActionResult> UpdateFeatureFlag(Guid id, [FromBody] FeatureFlagDto dto)
    {
        var flag = await _db.FeatureFlags.FindAsync(id);
        if (flag == null) return NotFound();

        flag.IsEnabled = dto.IsEnabled;
        flag.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(flag);
    }

    // GET: api/superadmin/system-health
    [HttpGet("system-health")]
    public async Task<IActionResult> GetSystemHealth()
    {
        var health = await _db.SystemHealths.ToListAsync();
        return Ok(health);
    }

    // GET: api/superadmin/audit-logs
    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        var logs = await _db.AuditLogs
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var total = await _db.AuditLogs.CountAsync();

        return Ok(new { logs, total, page, limit });
    }

    // POST: api/superadmin/audit-logs
    [HttpPost("audit-logs")]
    public async Task<IActionResult> CreateAuditLog([FromBody] AuditLog dto)
    {
        dto.Id = Guid.NewGuid();
        dto.CreatedAt = DateTime.UtcNow;

        _db.AuditLogs.Add(dto);
        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    // GET: api/superadmin/api-keys
    [HttpGet("api-keys")]
    public async Task<IActionResult> GetApiKeys()
    {
        var keys = await _db.ApiKeys
            .Include(k => k.User)
            .ToListAsync();

        return Ok(keys);
    }
}

public class FeatureFlagDto
{
    public bool IsEnabled { get; set; }
}
