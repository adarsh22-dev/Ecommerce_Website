using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.DTOs.Requests;
using EcommerceApi.DTOs.Responses;
using EcommerceApi.Models;
using System.Security.Claims;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReviewsController(AppDbContext db) => _db = db;

    [HttpGet("product/{productId}")]
    public async Task<ActionResult<List<ReviewResponse>>> GetProductReviews(Guid productId, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var reviews = await _db.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return Ok(reviews.Select(r => new ReviewResponse(
            r.Id, r.Rating, r.Title, r.Body, r.IsVerified, r.CreatedAt, r.User.FullName
        )).ToList());
    }

    [Authorize]
    [HttpPost("product/{productId}")]
    public async Task<ActionResult<ApiResponse<object>>> Create(Guid productId, [FromBody] CreateReviewRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (await _db.Reviews.AnyAsync(r => r.ProductId == productId && r.UserId == userId))
            return BadRequest(new ApiResponse<object>(null, "You already reviewed this product"));

        var review = new Review
        {
            ProductId = productId,
            UserId = userId,
            Rating = request.Rating,
            Title = request.Title,
            Body = request.Body,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return Ok(new ApiResponse<object>(new { message = "Review created" }, null));
    }
}
