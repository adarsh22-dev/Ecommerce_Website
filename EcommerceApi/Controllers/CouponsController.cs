using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.DTOs.Responses;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly AppDbContext _db;

    public CouponsController(AppDbContext db) => _db = db;

    [HttpGet("validate/{code}")]
    public async Task<ActionResult<ApiResponse<object>>> Validate(string code, [FromQuery] decimal orderTotal)
    {
        var coupon = await _db.Coupons
            .FirstOrDefaultAsync(c => c.Code == code.ToUpper() && c.IsActive);

        if (coupon == null)
            return Ok(new ApiResponse<object>(null, "Invalid coupon code"));

        var now = DateTime.UtcNow;
        if (coupon.ValidFrom > now)
            return Ok(new ApiResponse<object>(null, "Coupon is not yet active"));
        if (coupon.ValidTo < now)
            return Ok(new ApiResponse<object>(null, "Coupon has expired"));
        if (coupon.UsageLimit.HasValue && coupon.TimesUsed >= coupon.UsageLimit)
            return Ok(new ApiResponse<object>(null, "Coupon usage limit reached"));
        if (coupon.MinOrderAmount > orderTotal)
            return Ok(new ApiResponse<object>(null, $"Minimum order amount is ${coupon.MinOrderAmount}"));

        var discount = coupon.Type == CouponType.Percentage
            ? orderTotal * coupon.Value / 100
            : coupon.Value;

        return Ok(new ApiResponse<object>(new
        {
            valid = true,
            discount = Math.Min(discount, orderTotal),
            coupon.Code,
            coupon.Type,
            coupon.Value,
        }, null));
    }
}
