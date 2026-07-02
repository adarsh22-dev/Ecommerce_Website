using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("products")]
public class Product
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Slug { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Column("category_id")]
    public Guid? CategoryId { get; set; }
    
    [ForeignKey("CategoryId")]
    public Category? Category { get; set; }
    
    [Column("vendor_id")]
    public Guid? VendorId { get; set; }
    
    [ForeignKey("VendorId")]
    public VendorProfile? Vendor { get; set; }
    
    [Column(TypeName = "numeric(10,2)")]
    public decimal Price { get; set; }
    
    [Column("sale_price", TypeName = "numeric(10,2)")]
    public decimal? SalePrice { get; set; }
    
    [Column("sale_start")]
    public DateTime? SaleStart { get; set; }
    
    [Column("sale_end")]
    public DateTime? SaleEnd { get; set; }
    
    [Required]
    public string Sku { get; set; } = string.Empty;
    
    [Column("stock_quantity")]
    public int StockQuantity { get; set; }
    
    [Column("track_inventory")]
    public bool TrackInventory { get; set; } = true;
    
    [Column("allow_backorders")]
    public bool AllowBackorders { get; set; }
    
    public ProductStatus Status { get; set; } = ProductStatus.Draft;
    
    [Column("meta_title")]
    public string? MetaTitle { get; set; }
    
    [Column("meta_description")]
    public string? MetaDescription { get; set; }
    
    [Column("og_image_url")]
    public string? OgImageUrl { get; set; }
    
    public string[] Tags { get; set; } = Array.Empty<string>();
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    public ICollection<ProductOption> ProductOptions { get; set; } = new List<ProductOption>();
    public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<WholesalePricing> WholesalePricings { get; set; } = new List<WholesalePricing>();
}

[Table("product_images")]
public class ProductImage
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("product_id")]
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
    
    [Column("image_url")]
    public string ImageUrl { get; set; } = string.Empty;
    
    [Column("sort_order")]
    public int SortOrder { get; set; }
    
    [Column("alt_text")]
    public string? AltText { get; set; }
}

[Table("product_options")]
public class ProductOption
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("product_id")]
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    
    [Column("sort_order")]
    public int SortOrder { get; set; }

    public ICollection<ProductOptionValue> ProductOptionValues { get; set; } = new List<ProductOptionValue>();
}

[Table("product_option_values")]
public class ProductOptionValue
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("option_id")]
    public Guid OptionId { get; set; }
    
    [ForeignKey("OptionId")]
    public ProductOption Option { get; set; } = null!;
    
    public string Value { get; set; } = string.Empty;
    
    [Column("sort_order")]
    public int SortOrder { get; set; }
}

[Table("product_variants")]
public class ProductVariant
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("product_id")]
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
    
    public string Sku { get; set; } = string.Empty;
    
    [Column(TypeName = "numeric(10,2)")]
    public decimal? Price { get; set; }
    
    [Column("stock_quantity")]
    public int StockQuantity { get; set; }
    
    [Column("option_values")]
    public string OptionValuesJson { get; set; } = "[]";
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
