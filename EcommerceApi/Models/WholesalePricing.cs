using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("wholesale_pricing")]
public class WholesalePricing
{
    [Key]
    public Guid Id { get; set; }

    [Column("product_id")]
    public Guid ProductId { get; set; }

    [Column("wholesaler_id")]
    public Guid? WholesalerId { get; set; }

    [Column("min_quantity")]
    public int MinQuantity { get; set; }

    [Column("max_quantity")]
    public int? MaxQuantity { get; set; }

    [Column("price_per_unit")]
    public decimal PricePerUnit { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Product Product { get; set; } = null!;
    public WholesalerProfile? Wholesaler { get; set; }
}
