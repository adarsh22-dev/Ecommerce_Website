using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly AppDbContext _db;

    public VendorsController(AppDbContext db) => _db = db;

    // GET: api/vendors
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vendors = await _db.VendorProfiles
            .Include(v => v.User)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return Ok(vendors);
    }

    // GET: api/vendors/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var vendor = await _db.VendorProfiles
            .Include(v => v.User)
            .Include(v => v.Wallet)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vendor == null) return NotFound();
        return Ok(vendor);
    }

    // POST: api/vendors
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] VendorProfile dto)
    {
        dto.Id = Guid.NewGuid();
        dto.Status = "pending";
        dto.VerificationStatus = "unverified";
        dto.CreatedAt = DateTime.UtcNow;
        dto.UpdatedAt = DateTime.UtcNow;

        _db.VendorProfiles.Add(dto);
        await _db.SaveChangesAsync();

        // Create wallet
        var wallet = new VendorWallet
        {
            Id = Guid.NewGuid(),
            VendorId = dto.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.VendorWallets.Add(wallet);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    // PUT: api/vendors/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] VendorProfile dto)
    {
        var vendor = await _db.VendorProfiles.FindAsync(id);
        if (vendor == null) return NotFound();

        vendor.BusinessName = dto.BusinessName;
        vendor.BusinessDescription = dto.BusinessDescription;
        vendor.BusinessAddress = dto.BusinessAddress;
        vendor.BusinessPhone = dto.BusinessPhone;
        vendor.BusinessEmail = dto.BusinessEmail;
        vendor.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(vendor);
    }

    // PUT: api/vendors/{id}/approve
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var vendor = await _db.VendorProfiles.FindAsync(id);
        if (vendor == null) return NotFound();

        vendor.Status = "approved";
        vendor.VerificationStatus = "verified";
        vendor.UpdatedAt = DateTime.UtcNow;

        // Update user role
        var user = await _db.Users.FindAsync(vendor.UserId);
        if (user != null)
        {
            user.Role = UserRole.Vendor;
            await _db.SaveChangesAsync();
        }

        return Ok(vendor);
    }

    // PUT: api/vendors/{id}/suspend
    [HttpPut("{id}/suspend")]
    public async Task<IActionResult> Suspend(Guid id)
    {
        var vendor = await _db.VendorProfiles.FindAsync(id);
        if (vendor == null) return NotFound();

        vendor.Status = "suspended";
        vendor.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(vendor);
    }

    // GET: api/vendors/{id}/products
    [HttpGet("{id}/products")]
    public async Task<IActionResult> GetVendorProducts(Guid id)
    {
        var products = await _db.Products
            .Include(p => p.ProductImages)
            .Where(p => p.VendorId == id)
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/vendors/{id}/wallet
    [HttpGet("{id}/wallet")]
    public async Task<IActionResult> GetVendorWallet(Guid id)
    {
        var wallet = await _db.VendorWallets
            .Include(w => w.Transactions)
            .FirstOrDefaultAsync(w => w.VendorId == id);

        if (wallet == null) return NotFound();
        return Ok(wallet);
    }

    // GET: api/vendors/{id}/orders
    [HttpGet("{id}/orders")]
    public async Task<IActionResult> GetVendorOrders(Guid id)
    {
        var orders = await _db.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
            .Where(oi => oi.Product.VendorId == id)
            .Select(oi => oi.Order)
            .Distinct()
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/vendors/{id}/analytics
    [HttpGet("{id}/analytics")]
    public async Task<IActionResult> GetVendorAnalytics(Guid id)
    {
        var vendor = await _db.VendorProfiles.FindAsync(id);
        if (vendor == null) return NotFound();

        var orderItems = await _db.OrderItems
            .Include(oi => oi.Product)
            .Where(oi => oi.Product.VendorId == id)
            .ToListAsync();

        var totalRevenue = orderItems.Sum(oi => oi.LineTotal);
        var totalOrders = orderItems.Select(oi => oi.OrderId).Distinct().Count();
        var totalProducts = await _db.Products.CountAsync(p => p.VendorId == id);

        return Ok(new
        {
            totalRevenue,
            totalOrders,
            totalProducts,
            averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        });
    }
}
