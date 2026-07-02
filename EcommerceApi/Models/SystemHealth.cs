using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("system_health")]
public class SystemHealth
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Column("service_name")]
    public string ServiceName { get; set; } = string.Empty;

    [Column("status")]
    public string Status { get; set; } = "healthy"; // healthy, degraded, down

    [Column("response_time_ms")]
    public int? ResponseTimeMs { get; set; }

    [Column("last_check")]
    public DateTime LastCheck { get; set; } = DateTime.UtcNow;

    [Column("details")]
    public string? Details { get; set; } // JSON

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
