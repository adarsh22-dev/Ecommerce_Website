using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("orders")]
public class Order
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("order_number")]
    public string OrderNumber { get; set; } = string.Empty;
    
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Column("shipping_address")]
    public string ShippingAddressJson { get; set; } = "{}";
    
    [Column("billing_address")]
    public string? BillingAddressJson { get; set; }
    
    [Column("shipping_method")]
    public string? ShippingMethod { get; set; }
    
    [Column("shipping_cost", TypeName = "numeric(10,2)")]
    public decimal ShippingCost { get; set; }
    
    [Column(TypeName = "numeric(10,2)")]
    public decimal Subtotal { get; set; }
    
    [Column("discount_amount", TypeName = "numeric(10,2)")]
    public decimal DiscountAmount { get; set; }
    
    [Column("tax_amount", TypeName = "numeric(10,2)")]
    public decimal TaxAmount { get; set; }
    
    [Column(TypeName = "numeric(10,2)")]
    public decimal Total { get; set; }
    
    [Column("coupon_code")]
    public string? CouponCode { get; set; }
    
    [Column("payment_status")]
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    [Column("fulfillment_status")]
    public FulfillmentStatus FulfillmentStatus { get; set; } = FulfillmentStatus.Pending;
    
    [Column("razorpay_payment_id")]
    public string? RazorpayPaymentId { get; set; }
    
    [Column("tracking_number")]
    public string? TrackingNumber { get; set; }
    
    [Column("tracking_carrier")]
    public string? TrackingCarrier { get; set; }
    
    public string? Notes { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<OrderTimeline> OrderTimelines { get; set; } = new List<OrderTimeline>();
}

[Table("order_items")]
public class OrderItem
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("order_id")]
    public Guid OrderId { get; set; }
    
    [ForeignKey("OrderId")]
    public Order Order { get; set; } = null!;
    
    [Column("product_id")]
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
    
    [Column("variant_id")]
    public Guid? VariantId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    [Column("variant_info")]
    public string? VariantInfoJson { get; set; }
    
    public int Quantity { get; set; }
    
    [Column("unit_price", TypeName = "numeric(10,2)")]
    public decimal UnitPrice { get; set; }
    
    [Column("line_total", TypeName = "numeric(10,2)")]
    public decimal LineTotal { get; set; }
}

[Table("order_timeline")]
public class OrderTimeline
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("order_id")]
    public Guid OrderId { get; set; }
    
    [ForeignKey("OrderId")]
    public Order Order { get; set; } = null!;
    
    public string Status { get; set; } = string.Empty;
    
    public string? Note { get; set; }
    
    [Column("created_by")]
    public Guid? CreatedBy { get; set; }
    
    [ForeignKey("CreatedBy")]
    public User? CreatedByUser { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
