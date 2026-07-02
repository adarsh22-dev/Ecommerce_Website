using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("addresses")]
public class Address
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;
    
    public string? Phone { get; set; }
    
    [Column("address_line1")]
    public string AddressLine1 { get; set; } = string.Empty;
    
    [Column("address_line2")]
    public string? AddressLine2 { get; set; }
    
    public string City { get; set; } = string.Empty;
    
    public string? State { get; set; }
    
    public string Zip { get; set; } = string.Empty;
    
    public string Country { get; set; } = "US";
    
    [Column("is_default")]
    public bool IsDefault { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
