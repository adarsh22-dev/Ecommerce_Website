using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WholesalersController : ControllerBase
{
    private readonly AppDbContext _db;

    public WholesalersController(AppDbContext db) => _db = db;

    // GET: api/wholesalers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var wholesalers = await _db.WholesalerProfiles
            .Include(w => w.User)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(wholesalers);
    }

    // GET: api/wholesalers/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var wholesaler = await _db.WholesalerProfiles
            .Include(w => w.User)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (wholesaler == null) return NotFound();
        return Ok(wholesaler);
    }

    // POST: api/wholesalers
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] WholesalerProfile dto)
    {
        dto.Id = Guid.NewGuid();
        dto.Status = "pending";
        dto.VerificationStatus = "unverified";
        dto.CreatedAt = DateTime.UtcNow;
        dto.UpdatedAt = DateTime.UtcNow;

        _db.WholesalerProfiles.Add(dto);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    // PUT: api/wholesalers/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] WholesalerProfile dto)
    {
        var wholesaler = await _db.WholesalerProfiles.FindAsync(id);
        if (wholesaler == null) return NotFound();

        wholesaler.BusinessName = dto.BusinessName;
        wholesaler.BusinessDescription = dto.BusinessDescription;
        wholesaler.BusinessAddress = dto.BusinessAddress;
        wholesaler.MinOrderAmount = dto.MinOrderAmount;
        wholesaler.CreditLimit = dto.CreditLimit;
        wholesaler.PaymentTermsDays = dto.PaymentTermsDays;
        wholesaler.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(wholesaler);
    }

    // PUT: api/wholesalers/{id}/approve
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var wholesaler = await _db.WholesalerProfiles.FindAsync(id);
        if (wholesaler == null) return NotFound();

        wholesaler.Status = "approved";
        wholesaler.VerificationStatus = "verified";
        wholesaler.UpdatedAt = DateTime.UtcNow;

        var user = await _db.Users.FindAsync(wholesaler.UserId);
        if (user != null)
        {
            user.Role = UserRole.Wholesaler;
            await _db.SaveChangesAsync();
        }

        return Ok(wholesaler);
    }

    // GET: api/wholesalers/{id}/pricing
    [HttpGet("{id}/pricing")]
    public async Task<IActionResult> GetPricing(Guid id)
    {
        var pricing = await _db.WholesalePricings
            .Include(wp => wp.Product)
            .Where(wp => wp.WholesalerId == id)
            .ToListAsync();

        return Ok(pricing);
    }

    // POST: api/wholesalers/{id}/pricing
    [HttpPost("{id}/pricing")]
    public async Task<IActionResult> CreatePricing(Guid id, [FromBody] WholesalePricing dto)
    {
        dto.Id = Guid.NewGuid();
        dto.WholesalerId = id;
        dto.CreatedAt = DateTime.UtcNow;

        _db.WholesalePricings.Add(dto);
        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    // GET: api/wholesalers/{id}/rfq
    [HttpGet("{id}/rfq")]
    public async Task<IActionResult> GetRfqRequests(Guid id)
    {
        var rfqs = await _db.RfqRequests
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .Where(r => r.WholesalerId == id)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(rfqs);
    }

    // PUT: api/wholesalers/rfq/{rfqId}/quote
    [HttpPut("rfq/{rfqId}/quote")]
    public async Task<IActionResult> QuoteRfq(Guid rfqId, [FromBody] QuoteDto dto)
    {
        var rfq = await _db.RfqRequests.FindAsync(rfqId);
        if (rfq == null) return NotFound();

        rfq.QuotedPrice = dto.Price;
        rfq.QuotedAt = DateTime.UtcNow;
        rfq.ValidUntil = DateTime.UtcNow.AddDays(7);
        rfq.Status = "quoted";
        rfq.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(rfq);
    }

    // GET: api/wholesalers/{id}/analytics
    [HttpGet("{id}/analytics")]
    public async Task<IActionResult> GetAnalytics(Guid id)
    {
        var wholesaler = await _db.WholesalerProfiles.FindAsync(id);
        if (wholesaler == null) return NotFound();

        var rfqCount = await _db.RfqRequests.CountAsync(r => r.WholesalerId == id);
        var acceptedCount = await _db.RfqRequests.CountAsync(r => r.WholesalerId == id && r.Status == "accepted");

        return Ok(new
        {
            wholesaler.Id,
            wholesaler.TotalSales,
            wholesaler.TotalOrders,
            wholesaler.CreditLimit,
            wholesaler.CreditUsed,
            rfqCount,
            acceptedCount,
            conversionRate = rfqCount > 0 ? (double)acceptedCount / rfqCount * 100 : 0
        });
    }
}

public class QuoteDto
{
    public decimal Price { get; set; }
}
