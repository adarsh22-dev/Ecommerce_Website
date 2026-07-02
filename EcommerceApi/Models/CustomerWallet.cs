using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("customer_wallets")]
public class CustomerWallet
{
    [Key]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("balance")]
    public decimal Balance { get; set; } = 0;

    [Column("total_earned")]
    public decimal TotalEarned { get; set; } = 0;

    [Column("total_spent")]
    public decimal TotalSpent { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}
