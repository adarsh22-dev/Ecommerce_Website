namespace EcommerceApi.DTOs.Requests;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password, string FullName);
public record CreateAddressRequest(
    string FullName, string? Phone, string AddressLine1, string? AddressLine2,
    string City, string? State, string Zip, string Country, bool IsDefault = false);

public record CreateProductRequest(
    string Title, string Slug, string? Description, Guid? CategoryId,
    decimal Price, decimal? SalePrice, DateTime? SaleStart, DateTime? SaleEnd,
    string Sku, int StockQuantity, bool TrackInventory, bool AllowBackorders,
    string Status, string[]? Tags, string? MetaTitle, string? MetaDescription);

public record CreateCategoryRequest(string Name, string Slug, string? Description, Guid? ParentId, int SortOrder = 0);

public record CreateCouponRequest(
    string Code, string Type, decimal Value, decimal? MinOrderAmount,
    int? UsageLimit, int? PerCustomerLimit, DateTime? ValidFrom, DateTime? ValidTo,
    bool IsActive = true);

public record CreateOrderRequest(
    string Email, string ShippingAddressJson, string? BillingAddressJson,
    string? ShippingMethod, decimal ShippingCost, decimal Subtotal,
    decimal DiscountAmount, decimal TaxAmount, decimal Total, string? CouponCode,
    List<CreateOrderItemRequest> Items);

public record CreateOrderItemRequest(Guid ProductId, Guid? VariantId, string Title, int Quantity, decimal UnitPrice);

public record CreateReviewRequest(int Rating, string? Title, string? Body);

public record UpdateSiteSettingsRequest(
    string? SiteName, string? Tagline, string? ContactEmail, string? ContactPhone,
    string? BusinessAddress, string? CurrencyCode, string? CurrencySymbol,
    decimal? TaxRate, bool? TaxInclusive, bool? AnnouncementBarActive,
    string? AnnouncementBarText, string? AnnouncementBarLink, string? AnnouncementBarColor,
    string? SocialInstagram, string? SocialFacebook, string? SocialTwitter,
    string? SocialTiktok, string? SocialYoutube);

public record ProductFilterRequest(
    string? Category, decimal? MinPrice, decimal? MaxPrice, bool? InStock,
    string? Search, string? Sort, int Page = 1, int Limit = 20);
