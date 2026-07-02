using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("vendor_subscriptions")]
public class VendorSubscription
{
    [Key]
    public Guid Id { get; set; }

    [Column("vendor_id")]
    public Guid VendorId { get; set; }

    [Required]
    [Column("plan_name")]
    public string PlanName { get; set; } = string.Empty;

    [Column("plan_price")]
    public decimal PlanPrice { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active"; // active, cancelled, expired

    [Column("starts_at")]
    public DateTime StartsAt { get; set; } = DateTime.UtcNow;

    [Column("expires_at")]
    public DateTime? ExpiresAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public VendorProfile Vendor { get; set; } = null!;
}
