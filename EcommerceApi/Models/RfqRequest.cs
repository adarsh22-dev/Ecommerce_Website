using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("rfq_requests")]
public class RfqRequest
{
    [Key]
    public Guid Id { get; set; }

    [Column("customer_id")]
    public Guid CustomerId { get; set; }

    [Column("wholesaler_id")]
    public Guid? WholesalerId { get; set; }

    [Column("product_id")]
    public Guid? ProductId { get; set; }

    [Required]
    [Column("product_name")]
    public string ProductName { get; set; } = string.Empty;

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("specifications")]
    public string? Specifications { get; set; } // JSON

    [Column("target_price")]
    public decimal? TargetPrice { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("status")]
    public string Status { get; set; } = "pending"; // pending, quoted, accepted, rejected, expired

    [Column("quoted_price")]
    public decimal? QuotedPrice { get; set; }

    [Column("quoted_at")]
    public DateTime? QuotedAt { get; set; }

    [Column("valid_until")]
    public DateTime? ValidUntil { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User Customer { get; set; } = null!;
    public WholesalerProfile? Wholesaler { get; set; }
    public Product? Product { get; set; }
}
