using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("profiles")]
public class User
{
    [Key]
    public Guid Id { get; set; }
    
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;
    
    public string? Phone { get; set; }
    
    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }
    
    public UserRole Role { get; set; } = UserRole.Customer;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
    
    // Enterprise navigation properties
    public VendorProfile? VendorProfile { get; set; }
    public WholesalerProfile? WholesalerProfile { get; set; }
    public CustomerWallet? CustomerWallet { get; set; }
    public ICollection<RewardPoint> RewardPoints { get; set; } = new List<RewardPoint>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    public ICollection<ApiKey> ApiKeys { get; set; } = new List<ApiKey>();
}
