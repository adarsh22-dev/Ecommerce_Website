using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("vendor_product_approvals")]
public class VendorProductApproval
{
    [Key]
    public Guid Id { get; set; }

    [Column("product_id")]
    public Guid ProductId { get; set; }

    [Column("vendor_id")]
    public Guid VendorId { get; set; }

    [Column("status")]
    public string Status { get; set; } = "pending"; // pending, approved, rejected

    [Column("review_notes")]
    public string? ReviewNotes { get; set; }

    [Column("reviewed_by")]
    public Guid? ReviewedBy { get; set; }

    [Column("reviewed_at")]
    public DateTime? ReviewedAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Product Product { get; set; } = null!;
    public VendorProfile Vendor { get; set; } = null!;
    public User? Reviewer { get; set; }
}
