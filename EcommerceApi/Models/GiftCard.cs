using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("gift_cards")]
public class GiftCard
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Column("code")]
    public string Code { get; set; } = string.Empty;

    [Column("balance")]
    public decimal Balance { get; set; }

    [Column("initial_amount")]
    public decimal InitialAmount { get; set; }

    [Column("buyer_id")]
    public Guid? BuyerId { get; set; }

    [Column("recipient_email")]
    public string? RecipientEmail { get; set; }

    [Column("recipient_name")]
    public string? RecipientName { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active"; // active, used, expired

    [Column("valid_from")]
    public DateTime ValidFrom { get; set; } = DateTime.UtcNow;

    [Column("valid_to")]
    public DateTime? ValidTo { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? Buyer { get; set; }
}
