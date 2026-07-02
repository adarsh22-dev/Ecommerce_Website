using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.DTOs.Responses;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<CategoryResponse>>> GetAll()
    {
        var categories = await _db.Categories
            .Include(c => c.Products)
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        return Ok(categories.Select(c => new CategoryResponse(
            c.Id, c.Name, c.Slug, c.Description, c.ImageUrl,
            c.ParentId, c.SortOrder, c.Products.Count(p => p.Status == ProductStatus.Active)
        )).ToList());
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<CategoryResponse>> GetBySlug(string slug)
    {
        var category = await _db.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (category == null) return NotFound();
        return Ok(new CategoryResponse(
            category.Id, category.Name, category.Slug, category.Description,
            category.ImageUrl, category.ParentId, category.SortOrder,
            category.Products.Count(p => p.Status == ProductStatus.Active)));
    }
}
