using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("categories")]
public class Category
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Slug { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Column("image_url")]
    public string? ImageUrl { get; set; }
    
    [Column("parent_id")]
    public Guid? ParentId { get; set; }
    
    [ForeignKey("ParentId")]
    public Category? Parent { get; set; }
    
    [Column("sort_order")]
    public int SortOrder { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Category> Children { get; set; } = new List<Category>();
}
