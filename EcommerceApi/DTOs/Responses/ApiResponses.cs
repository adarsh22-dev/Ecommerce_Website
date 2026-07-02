namespace EcommerceApi.DTOs.Responses;

public record AuthResponse(string Token, string Email, string FullName, string Role, Guid UserId);
public record ProductResponse(
    Guid Id, string Title, string Slug, string? Description, Guid? CategoryId,
    string? CategoryName, decimal Price, decimal? SalePrice, string Sku,
    int StockQuantity, string Status, string[] Tags, DateTime CreatedAt,
    List<ProductImageResponse> Images, List<ProductOptionResponse> Options,
    List<ProductVariantResponse> Variants, double? AverageRating, int? ReviewCount);

public record ProductListResponse(List<ProductResponse> Products, int Total);
public record ProductImageResponse(Guid Id, string ImageUrl, int SortOrder, string? AltText);
public record ProductOptionResponse(Guid Id, string Name, List<ProductOptionValueResponse> Values);
public record ProductOptionValueResponse(Guid Id, string Value);
public record ProductVariantResponse(Guid Id, string Sku, decimal? Price, int StockQuantity, string OptionValuesJson);

public record CategoryResponse(Guid Id, string Name, string Slug, string? Description, string? ImageUrl, Guid? ParentId, int SortOrder, int ProductCount);

public record OrderResponse(
    Guid Id, string OrderNumber, string Email, string ShippingAddressJson,
    string? ShippingMethod, decimal ShippingCost, decimal Subtotal,
    decimal DiscountAmount, decimal TaxAmount, decimal Total, string? CouponCode,
    string PaymentStatus, string FulfillmentStatus, string? TrackingNumber,
    string? TrackingCarrier, DateTime CreatedAt,
    List<OrderItemResponse> Items, List<OrderTimelineResponse> Timeline);

public record OrderItemResponse(Guid Id, string Title, int Quantity, decimal UnitPrice, decimal LineTotal, string? VariantInfoJson);
public record OrderTimelineResponse(string Status, string? Note, DateTime CreatedAt);

public record ReviewResponse(Guid Id, int Rating, string? Title, string? Body, bool IsVerified, DateTime CreatedAt, string? UserName);

public record CouponResponse(Guid Id, string Code, string Type, decimal Value, decimal? MinOrderAmount, int? UsageLimit, int TimesUsed, bool IsActive, DateTime? ValidFrom, DateTime? ValidTo);

public record AddressResponse(Guid Id, string FullName, string? Phone, string AddressLine1, string? AddressLine2, string City, string? State, string Zip, string Country, bool IsDefault);

public record DashboardStatsResponse(decimal TotalRevenue, int TotalOrders, int TotalCustomers, decimal AvgOrderValue, decimal RevenueChange, List<LowStockProduct> LowStockProducts);

public record LowStockProduct(Guid Id, string Title, int StockQuantity);

public record RevenueChartPoint(string Date, decimal Revenue);

public record ApiResponse<T>(T? Data, string? Error);
