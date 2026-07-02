using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RfqController : ControllerBase
{
    private readonly AppDbContext _db;

    public RfqController(AppDbContext db) => _db = db;

    // GET: api/rfq
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rfqs = await _db.RfqRequests
            .Include(r => r.Customer)
            .Include(r => r.Wholesaler)
            .Include(r => r.Product)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(rfqs);
    }

    // GET: api/rfq/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var rfq = await _db.RfqRequests
            .Include(r => r.Customer)
            .Include(r => r.Wholesaler)
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rfq == null) return NotFound();
        return Ok(rfq);
    }

    // POST: api/rfq
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RfqRequest dto)
    {
        dto.Id = Guid.NewGuid();
        dto.Status = "pending";
        dto.CreatedAt = DateTime.UtcNow;
        dto.UpdatedAt = DateTime.UtcNow;

        _db.RfqRequests.Add(dto);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    // PUT: api/rfq/{id}/accept
    [HttpPut("{id}/accept")]
    public async Task<IActionResult> Accept(Guid id)
    {
        var rfq = await _db.RfqRequests.FindAsync(id);
        if (rfq == null) return NotFound();

        rfq.Status = "accepted";
        rfq.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(rfq);
    }

    // PUT: api/rfq/{id}/reject
    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var rfq = await _db.RfqRequests.FindAsync(id);
        if (rfq == null) return NotFound();

        rfq.Status = "rejected";
        rfq.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(rfq);
    }
}
