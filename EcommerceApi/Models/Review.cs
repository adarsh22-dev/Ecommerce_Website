using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models;

[Table("reviews")]
public class Review
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("product_id")]
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
    
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Range(1, 5)]
    public int Rating { get; set; }
    
    public string? Title { get; set; }
    
    public string? Body { get; set; }
    
    [Column("is_verified")]
    public bool IsVerified { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("coupons")]
public class Coupon
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public string Code { get; set; } = string.Empty;
    
    public CouponType Type { get; set; }
    
    [Column(TypeName = "numeric(10,2)")]
    public decimal Value { get; set; }
    
    [Column("min_order_amount", TypeName = "numeric(10,2)")]
    public decimal? MinOrderAmount { get; set; }
    
    [Column("usage_limit")]
    public int? UsageLimit { get; set; }
    
    [Column("per_customer_limit")]
    public int? PerCustomerLimit { get; set; }
    
    [Column("times_used")]
    public int TimesUsed { get; set; }
    
    [Column("valid_from")]
    public DateTime? ValidFrom { get; set; }
    
    [Column("valid_to")]
    public DateTime? ValidTo { get; set; }
    
    [Column("applicable_products")]
    public Guid[]? ApplicableProducts { get; set; }
    
    [Column("applicable_categories")]
    public Guid[]? ApplicableCategories { get; set; }
    
    [Column("is_active")]
    public bool IsActive { get; set; } = true;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("wishlist")]
public class WishlistItem
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Column("product_id")]
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("subscribers")]
public class Subscriber
{
    [Key]
    public Guid Id { get; set; }
    
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("hero_slides")]
public class HeroSlide
{
    [Key]
    public Guid Id { get; set; }
    
    [Column("image_url")]
    public string ImageUrl { get; set; } = string.Empty;
    
    public string? Heading { get; set; }
    
    public string? Subheading { get; set; }
    
    [Column("cta_text")]
    public string? CtaText { get; set; }
    
    [Column("cta_link")]
    public string? CtaLink { get; set; }
    
    [Column("sort_order")]
    public int SortOrder { get; set; }
    
    [Column("is_active")]
    public bool IsActive { get; set; } = true;
}

[Table("media")]
public class Media
{
    [Key]
    public Guid Id { get; set; }
    
    public string Url { get; set; } = string.Empty;
    
    public string Filename { get; set; } = string.Empty;
    
    public int Size { get; set; }
    
    [Column("mime_type")]
    public string MimeType { get; set; } = string.Empty;
    
    [Column("uploaded_by")]
    public Guid? UploadedBy { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("site_settings")]
public class SiteSettings
{
    [Key]
    public string Id { get; set; } = "1";
    
    [Column("site_name")]
    public string SiteName { get; set; } = "ECOM";
    
    public string? Tagline { get; set; }
    
    [Column("logo_url")]
    public string? LogoUrl { get; set; }
    
    [Column("logo_inverted_url")]
    public string? LogoInvertedUrl { get; set; }
    
    [Column("favicon_url")]
    public string? FaviconUrl { get; set; }
    
    [Column("contact_email")]
    public string? ContactEmail { get; set; }
    
    [Column("contact_phone")]
    public string? ContactPhone { get; set; }
    
    [Column("business_address")]
    public string? BusinessAddress { get; set; }
    
    [Column("currency_code")]
    public string CurrencyCode { get; set; } = "USD";
    
    [Column("currency_symbol")]
    public string CurrencySymbol { get; set; } = "$";
    
    [Column("tax_rate", TypeName = "numeric(5,2)")]
    public decimal TaxRate { get; set; }
    
    [Column("tax_inclusive")]
    public bool TaxInclusive { get; set; }
    
    [Column("announcement_bar_active")]
    public bool AnnouncementBarActive { get; set; }
    
    [Column("announcement_bar_text")]
    public string? AnnouncementBarText { get; set; }
    
    [Column("announcement_bar_link")]
    public string? AnnouncementBarLink { get; set; }
    
    [Column("announcement_bar_color")]
    public string? AnnouncementBarColor { get; set; }
    
    [Column("social_instagram")]
    public string? SocialInstagram { get; set; }
    
    [Column("social_facebook")]
    public string? SocialFacebook { get; set; }
    
    [Column("social_twitter")]
    public string? SocialTwitter { get; set; }
    
    [Column("social_tiktok")]
    public string? SocialTiktok { get; set; }
    
    [Column("social_youtube")]
    public string? SocialYoutube { get; set; }
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
