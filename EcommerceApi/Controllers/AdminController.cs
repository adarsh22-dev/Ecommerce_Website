using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.DTOs.Requests;
using EcommerceApi.DTOs.Responses;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db) => _db = db;

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsResponse>> GetDashboard()
    {
        var now = DateTime.UtcNow;
        var thirtyDaysAgo = now.AddDays(-30);
        var sixtyDaysAgo = now.AddDays(-60);

        var currentOrders = await _db.Orders.Where(o => o.CreatedAt >= thirtyDaysAgo).ToListAsync();
        var prevOrders = await _db.Orders.Where(o => o.CreatedAt >= sixtyDaysAgo && o.CreatedAt < thirtyDaysAgo).ToListAsync();
        var totalCustomers = await _db.Users.CountAsync(u => u.Role == UserRole.Customer);
        var lowStock = await _db.Products.Where(p => p.StockQuantity <= 10 && p.StockQuantity > 0).ToListAsync();

        var currentRevenue = currentOrders.Sum(o => o.Total);
        var prevRevenue = prevOrders.Sum(o => o.Total);
        var revenueChange = prevRevenue > 0 ? (currentRevenue - prevRevenue) / prevRevenue * 100 : 0;

        return Ok(new DashboardStatsResponse(
            currentRevenue, currentOrders.Count, totalCustomers,
            currentOrders.Count > 0 ? currentRevenue / currentOrders.Count : 0,
            revenueChange,
            lowStock.Select(p => new LowStockProduct(p.Id, p.Title, p.StockQuantity)).ToList()));
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<List<RevenueChartPoint>>> GetRevenue([FromQuery] string period = "30d")
    {
        var days = period switch
        {
            "7d" => 7, "90d" => 90, "1y" => 365, _ => 30
        };

        var startDate = DateTime.UtcNow.AddDays(-days);
        var orders = await _db.Orders
            .Where(o => o.CreatedAt >= startDate)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync();

        var grouped = orders
            .GroupBy(o => o.CreatedAt.ToString("MMM dd"))
            .Select(g => new RevenueChartPoint(g.Key, g.Sum(o => o.Total)))
            .ToList();

        return Ok(grouped);
    }

    [HttpGet("settings")]
    public async Task<ActionResult<SiteSettings>> GetSettings()
    {
        var settings = await _db.SiteSettings.FirstOrDefaultAsync();
        return Ok(settings ?? new SiteSettings());
    }

    [HttpPut("settings")]
    public async Task<ActionResult> UpdateSettings([FromBody] UpdateSiteSettingsRequest request)
    {
        var settings = await _db.SiteSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new SiteSettings();
            _db.SiteSettings.Add(settings);
        }

        if (request.SiteName != null) settings.SiteName = request.SiteName;
        if (request.Tagline != null) settings.Tagline = request.Tagline;
        if (request.ContactEmail != null) settings.ContactEmail = request.ContactEmail;
        if (request.ContactPhone != null) settings.ContactPhone = request.ContactPhone;
        if (request.BusinessAddress != null) settings.BusinessAddress = request.BusinessAddress;
        if (request.CurrencyCode != null) settings.CurrencyCode = request.CurrencyCode;
        if (request.CurrencySymbol != null) settings.CurrencySymbol = request.CurrencySymbol;
        if (request.TaxRate.HasValue) settings.TaxRate = request.TaxRate.Value;
        if (request.TaxInclusive.HasValue) settings.TaxInclusive = request.TaxInclusive.Value;
        if (request.AnnouncementBarActive.HasValue) settings.AnnouncementBarActive = request.AnnouncementBarActive.Value;
        if (request.AnnouncementBarText != null) settings.AnnouncementBarText = request.AnnouncementBarText;
        if (request.AnnouncementBarLink != null) settings.AnnouncementBarLink = request.AnnouncementBarLink;
        if (request.AnnouncementBarColor != null) settings.AnnouncementBarColor = request.AnnouncementBarColor;
        if (request.SocialInstagram != null) settings.SocialInstagram = request.SocialInstagram;
        if (request.SocialFacebook != null) settings.SocialFacebook = request.SocialFacebook;
        if (request.SocialTwitter != null) settings.SocialTwitter = request.SocialTwitter;
        if (request.SocialTiktok != null) settings.SocialTiktok = request.SocialTiktok;
        if (request.SocialYoutube != null) settings.SocialYoutube = request.SocialYoutube;
        settings.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Settings updated" });
    }

    [HttpGet("hero-slides")]
    public async Task<ActionResult<List<HeroSlide>>> GetHeroSlides()
    {
        var slides = await _db.HeroSlides.OrderBy(s => s.SortOrder).ToListAsync();
        return Ok(slides);
    }

    [HttpPut("hero-slides")]
    public async Task<ActionResult> UpdateHeroSlides([FromBody] List<HeroSlide> slides)
    {
        _db.HeroSlides.RemoveRange(_db.HeroSlides);
        foreach (var slide in slides)
        {
            slide.Id = Guid.NewGuid();
            _db.HeroSlides.Add(slide);
        }
        await _db.SaveChangesAsync();
        return Ok(new { message = "Hero slides updated" });
    }

    [HttpGet("products")]
    public async Task<ActionResult<ProductListResponse>> GetAllProducts([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var query = _db.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .OrderByDescending(p => p.CreatedAt);

        var total = await query.CountAsync();
        var products = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

        return Ok(new ProductListResponse(
            products.Select(p => new ProductResponse(
                p.Id, p.Title, p.Slug, p.Description, p.CategoryId, p.Category?.Name,
                p.Price, p.SalePrice, p.Sku, p.StockQuantity, p.Status.ToString(), p.Tags, p.CreatedAt,
                p.ProductImages.Select(i => new ProductImageResponse(i.Id, i.ImageUrl, i.SortOrder, i.AltText)).ToList(),
                new List<ProductOptionResponse>(), new List<ProductVariantResponse>(), null, null
            )).ToList(), total));
    }
}
