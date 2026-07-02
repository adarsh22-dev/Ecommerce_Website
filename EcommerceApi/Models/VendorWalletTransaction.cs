using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("vendor_wallet_transactions")]
public class VendorWalletTransaction
{
    [Key]
    public Guid Id { get; set; }

    [Column("vendor_id")]
    public Guid VendorId { get; set; }

    [Column("type")]
    public string Type { get; set; } = "credit"; // credit, debit, withdrawal, commission

    [Column("amount")]
    public decimal Amount { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("reference_id")]
    public Guid? ReferenceId { get; set; }

    [Column("reference_type")]
    public string? ReferenceType { get; set; }

    [Column("status")]
    public string Status { get; set; } = "completed"; // pending, completed, failed

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public VendorProfile Vendor { get; set; } = null!;
}
