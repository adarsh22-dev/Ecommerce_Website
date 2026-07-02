using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("reward_points")]
public class RewardPoint
{
    [Key]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("points")]
    public int Points { get; set; } = 0;

    [Column("expires_at")]
    public DateTime? ExpiresAt { get; set; }

    [Column("source")]
    public string? Source { get; set; }

    [Column("reference_id")]
    public Guid? ReferenceId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}
