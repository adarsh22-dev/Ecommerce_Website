using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("vendor_profiles")]
public class VendorProfile
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

    [Column("bank_account_number")]
    public string? BankAccountNumber { get; set; }

    [Column("bank_ifsc")]
    public string? BankIfsc { get; set; }

    [Column("bank_name")]
    public string? BankName { get; set; }

    [Column("commission_rate")]
    public decimal CommissionRate { get; set; } = 10.00m;

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
    public VendorWallet? Wallet { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<VendorWalletTransaction> WalletTransactions { get; set; } = new List<VendorWalletTransaction>();
}
