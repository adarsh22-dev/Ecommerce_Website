using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("vendor_wallets")]
public class VendorWallet
{
    [Key]
    public Guid Id { get; set; }

    [Column("vendor_id")]
    public Guid VendorId { get; set; }

    [Column("pending_balance")]
    public decimal PendingBalance { get; set; } = 0;

    [Column("available_balance")]
    public decimal AvailableBalance { get; set; } = 0;

    [Column("total_earned")]
    public decimal TotalEarned { get; set; } = 0;

    [Column("total_withdrawn")]
    public decimal TotalWithdrawn { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public VendorProfile Vendor { get; set; } = null!;
    public ICollection<VendorWalletTransaction> Transactions { get; set; } = new List<VendorWalletTransaction>();
}
