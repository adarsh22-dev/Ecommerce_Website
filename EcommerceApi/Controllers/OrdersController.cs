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
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    private Guid UserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Create([FromBody] CreateOrderRequest request)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = UserId,
            Email = request.Email,
            ShippingAddressJson = request.ShippingAddressJson,
            BillingAddressJson = request.BillingAddressJson,
            ShippingMethod = request.ShippingMethod,
            ShippingCost = request.ShippingCost,
            Subtotal = request.Subtotal,
            DiscountAmount = request.DiscountAmount,
            TaxAmount = request.TaxAmount,
            Total = request.Total,
            CouponCode = request.CouponCode,
            PaymentStatus = PaymentStatus.Pending,
            FulfillmentStatus = FulfillmentStatus.Pending,
            OrderNumber = $"ORD-{DateTime.UtcNow.Ticks % 100000}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _db.Orders.Add(order);

        foreach (var item in request.Items)
        {
            _db.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                VariantId = item.VariantId,
                Title = item.Title,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                LineTotal = item.UnitPrice * item.Quantity,
            });
        }

        _db.OrderTimelines.Add(new OrderTimeline
        {
            OrderId = order.Id,
            Status = "pending",
            Note = "Order placed",
            CreatedBy = UserId,
            CreatedAt = DateTime.UtcNow,
        });

        await _db.SaveChangesAsync();
        return Ok(new ApiResponse<OrderResponse>(MapToResponse(order), null));
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetMyOrders([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var query = _db.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.OrderTimelines)
            .Where(o => o.UserId == UserId || IsAdmin)
            .OrderByDescending(o => o.CreatedAt);

        var orders = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
        return Ok(orders.Select(MapToResponse).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetById(Guid id)
    {
        var order = await _db.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.OrderTimelines.OrderBy(t => t.CreatedAt))
            .FirstOrDefaultAsync(o => o.Id == id && (o.UserId == UserId || IsAdmin));

        if (order == null) return NotFound();
        return Ok(MapToResponse(order));
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.FulfillmentStatus = Enum.Parse<FulfillmentStatus>(request.Status);
        order.UpdatedAt = DateTime.UtcNow;

        _db.OrderTimelines.Add(new OrderTimeline
        {
            OrderId = id,
            Status = request.Status,
            Note = request.Note ?? $"Status updated to {request.Status}",
            CreatedBy = UserId,
        });

        await _db.SaveChangesAsync();
        return Ok(new { message = "Order status updated" });
    }

    [HttpPut("{id}/tracking")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateTracking(Guid id, [FromBody] UpdateTrackingRequest request)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.TrackingNumber = request.TrackingNumber;
        order.TrackingCarrier = request.Carrier;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Tracking updated" });
    }

    private OrderResponse MapToResponse(Order o) => new(
        o.Id, o.OrderNumber, o.Email, o.ShippingAddressJson,
        o.ShippingMethod, o.ShippingCost, o.Subtotal,
        o.DiscountAmount, o.TaxAmount, o.Total, o.CouponCode,
        o.PaymentStatus.ToString(), o.FulfillmentStatus.ToString(),
        o.TrackingNumber, o.TrackingCarrier, o.CreatedAt,
        o.OrderItems.Select(i => new OrderItemResponse(i.Id, i.Title, i.Quantity, i.UnitPrice, i.LineTotal, i.VariantInfoJson)).ToList(),
        o.OrderTimelines.Select(t => new OrderTimelineResponse(t.Status, t.Note, t.CreatedAt)).ToList());
}

public record UpdateStatusRequest(string Status, string? Note);
public record UpdateTrackingRequest(string TrackingNumber, string Carrier);
