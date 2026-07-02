using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("wholesaler_profiles")]
public class WholesalerProfile
{
    [Key]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Required]
    [Column("business_name")]
    public string BusinessName { get; set; } = string.Empty;

    [Column("business_description")]
    public string? BusinessDescription { get; set; }

    [Column("business_logo_url")]
    public string? BusinessLogoUrl { get; set; }

    [Column("business_address")]
    public string? BusinessAddress { get; set; }

    [Column("business_phone")]
    public string? BusinessPhone { get; set; }

    [Column("business_email")]
    public string? BusinessEmail { get; set; }

    [Column("tax_id")]
    public string? TaxId { get; set; }

    [Column("gst_number")]
    public string? GstNumber { get; set; }

    [Column("pan_number")]
    public string? PanNumber { get; set; }

    [Column("min_order_amount")]
    public decimal MinOrderAmount { get; set; } = 0;

    [Column("credit_limit")]
    public decimal CreditLimit { get; set; } = 0;

    [Column("credit_used")]
    public decimal CreditUsed { get; set; } = 0;

    [Column("payment_terms_days")]
    public int PaymentTermsDays { get; set; } = 30;

    [Column("status")]
    public string Status { get; set; } = "pending";

    [Column("verification_status")]
    public string VerificationStatus { get; set; } = "unverified";

    [Column("rating")]
    public decimal? Rating { get; set; }

    [Column("total_sales")]
    public decimal TotalSales { get; set; } = 0;

    [Column("total_orders")]
    public int TotalOrders { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<WholesalePricing> WholesalePricings { get; set; } = new List<WholesalePricing>();
    public ICollection<RfqRequest> RfqRequests { get; set; } = new List<RfqRequest>();
}
