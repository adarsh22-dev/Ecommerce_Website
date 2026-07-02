using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.DTOs.Requests;
using EcommerceApi.DTOs.Responses;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ProductListResponse>> GetProducts([FromQuery] ProductFilterRequest filters)
    {
        var query = _db.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .Include(p => p.ProductOptions.OrderBy(o => o.SortOrder))
                .ThenInclude(o => o.ProductOptionValues.OrderBy(v => v.SortOrder))
            .Include(p => p.ProductVariants)
            .Include(p => p.Reviews)
            .Where(p => p.Status == ProductStatus.Active)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filters.Category))
            query = query.Where(p => p.CategoryId == Guid.Parse(filters.Category));
        if (filters.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filters.MinPrice.Value);
        if (filters.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filters.MaxPrice.Value);
        if (filters.InStock == true)
            query = query.Where(p => p.StockQuantity > 0);
        if (!string.IsNullOrEmpty(filters.Search))
            query = query.Where(p => p.Title.Contains(filters.Search) || p.Description!.Contains(filters.Search));

        query = filters.Sort switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt),
        };

        var total = await query.CountAsync();
        var products = await query
            .Skip((filters.Page - 1) * filters.Limit)
            .Take(filters.Limit)
            .ToListAsync();

        return Ok(new ProductListResponse(
            products.Select(MapToResponse).ToList(), total));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductResponse>> GetBySlug(string slug)
    {
        var product = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .Include(p => p.ProductOptions.OrderBy(o => o.SortOrder))
                .ThenInclude(o => o.ProductOptionValues.OrderBy(v => v.SortOrder))
            .Include(p => p.ProductVariants)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == ProductStatus.Active);

        if (product == null) return NotFound();
        return Ok(MapToResponse(product));
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProductResponse>>> GetFeatured([FromQuery] int limit = 8)
    {
        var products = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .Where(p => p.Status == ProductStatus.Active)
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return Ok(products.Select(MapToResponse).ToList());
    }

    [HttpGet("related/{productId}")]
    public async Task<ActionResult<List<ProductResponse>>> GetRelated(Guid productId, [FromQuery] int limit = 4)
    {
        var product = await _db.Products.FindAsync(productId);
        if (product?.CategoryId == null) return Ok(new List<ProductResponse>());

        var related = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages.OrderBy(i => i.SortOrder))
            .Where(p => p.CategoryId == product.CategoryId && p.Id != productId && p.Status == ProductStatus.Active)
            .Take(limit)
            .ToListAsync();

        return Ok(related.Select(MapToResponse).ToList());
    }

    private static ProductResponse MapToResponse(Product p)
    {
        var avgRating = p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => r.Rating), 1) : 0;
        return new ProductResponse(
            p.Id, p.Title, p.Slug, p.Description, p.CategoryId,
            p.Category?.Name, p.Price, p.SalePrice, p.Sku,
            p.StockQuantity, p.Status.ToString(), p.Tags, p.CreatedAt,
            p.ProductImages.Select(i => new ProductImageResponse(i.Id, i.ImageUrl, i.SortOrder, i.AltText)).ToList(),
            p.ProductOptions.Select(o => new ProductOptionResponse(o.Id, o.Name,
                o.ProductOptionValues.Select(v => new ProductOptionValueResponse(v.Id, v.Value)).ToList())).ToList(),
            p.ProductVariants.Select(v => new ProductVariantResponse(v.Id, v.Sku, v.Price, v.StockQuantity, v.OptionValuesJson)).ToList(),
            avgRating, p.Reviews.Count);
    }
}
