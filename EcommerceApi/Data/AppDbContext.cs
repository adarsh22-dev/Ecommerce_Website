using Microsoft.EntityFrameworkCore;
using EcommerceApi.Models;

namespace EcommerceApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Core
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductOption> ProductOptions => Set<ProductOption>();
    public DbSet<ProductOptionValue> ProductOptionValues => Set<ProductOptionValue>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderTimeline> OrderTimelines => Set<OrderTimeline>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Subscriber> Subscribers => Set<Subscriber>();
    public DbSet<HeroSlide> HeroSlides => Set<HeroSlide>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<Media> Media => Set<Media>();
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();

    // Enterprise - Vendor
    public DbSet<VendorProfile> VendorProfiles => Set<VendorProfile>();
    public DbSet<VendorWallet> VendorWallets => Set<VendorWallet>();
    public DbSet<VendorWalletTransaction> VendorWalletTransactions => Set<VendorWalletTransaction>();
    public DbSet<VendorProductApproval> VendorProductApprovals => Set<VendorProductApproval>();
    public DbSet<VendorSubscription> VendorSubscriptions => Set<VendorSubscription>();

    // Enterprise - Wholesaler
    public DbSet<WholesalerProfile> WholesalerProfiles => Set<WholesalerProfile>();
    public DbSet<WholesalePricing> WholesalePricings => Set<WholesalePricing>();
    public DbSet<RfqRequest> RfqRequests => Set<RfqRequest>();

    // Enterprise - Customer
    public DbSet<CustomerWallet> CustomerWallets => Set<CustomerWallet>();
    public DbSet<RewardPoint> RewardPoints => Set<RewardPoint>();
    public DbSet<GiftCard> GiftCards => Set<GiftCard>();

    // Enterprise - System
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<FeatureFlag> FeatureFlags => Set<FeatureFlag>();
    public DbSet<SystemHealth> SystemHealths => Set<SystemHealth>();
    public DbSet<ApiKey> ApiKeys => Set<ApiKey>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
        });

        // Product
        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(p => p.Slug).IsUnique();
            e.HasIndex(p => p.Sku).IsUnique();
            e.HasIndex(p => p.Status);
            e.Property(p => p.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(p => p.Tags).HasColumnType("text[]");
        });

        // Category
        modelBuilder.Entity<Category>(e =>
        {
            e.HasIndex(c => c.Slug).IsUnique();
            e.HasOne(c => c.Parent).WithMany(c => c.Children).HasForeignKey(c => c.ParentId).OnDelete(DeleteBehavior.Restrict);
        });

        // Order
        modelBuilder.Entity<Order>(e =>
        {
            e.HasIndex(o => o.OrderNumber).IsUnique();
            e.HasIndex(o => o.UserId);
            e.Property(o => o.PaymentStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(o => o.FulfillmentStatus).HasConversion<string>().HasMaxLength(20);
        });

        // Coupon
        modelBuilder.Entity<Coupon>(e =>
        {
            e.HasIndex(c => c.Code).IsUnique();
            e.Property(c => c.Type).HasConversion<string>().HasMaxLength(20);
        });

        // Review
        modelBuilder.Entity<Review>(e =>
        {
            e.HasIndex(r => r.ProductId);
            e.HasIndex(r => r.UserId);
        });

        // Wishlist
        modelBuilder.Entity<WishlistItem>(e =>
        {
            e.HasIndex(w => new { w.UserId, w.ProductId }).IsUnique();
        });

        // Vendor Profile
        modelBuilder.Entity<VendorProfile>(e =>
        {
            e.HasIndex(v => v.UserId).IsUnique();
            e.HasIndex(v => v.Status);
            e.HasOne(v => v.User).WithOne(u => u.VendorProfile).HasForeignKey<VendorProfile>(v => v.UserId);
            e.HasOne(v => v.Wallet).WithOne(w => w.Vendor).HasForeignKey<VendorWallet>(w => w.VendorId);
        });

        // Vendor Wallet
        modelBuilder.Entity<VendorWallet>(e =>
        {
            e.HasIndex(w => w.VendorId).IsUnique();
        });

        // Vendor Wallet Transaction
        modelBuilder.Entity<VendorWalletTransaction>(e =>
        {
            e.HasIndex(t => t.VendorId);
            e.HasOne(t => t.Vendor).WithMany(v => v.WalletTransactions).HasForeignKey(t => t.VendorId);
        });

        // Vendor Product Approval
        modelBuilder.Entity<VendorProductApproval>(e =>
        {
            e.HasIndex(a => new { a.ProductId, a.VendorId });
            e.HasOne(a => a.Product).WithMany().HasForeignKey(a => a.ProductId);
            e.HasOne(a => a.Vendor).WithMany().HasForeignKey(a => a.VendorId);
        });

        // Vendor Subscription
        modelBuilder.Entity<VendorSubscription>(e =>
        {
            e.HasIndex(s => s.VendorId);
            e.HasOne(s => s.Vendor).WithMany().HasForeignKey(s => s.VendorId);
        });

        // Wholesaler Profile
        modelBuilder.Entity<WholesalerProfile>(e =>
        {
            e.HasIndex(w => w.UserId).IsUnique();
            e.HasIndex(w => w.Status);
            e.HasOne(w => w.User).WithOne(u => u.WholesalerProfile).HasForeignKey<WholesalerProfile>(w => w.UserId);
        });

        // Wholesale Pricing
        modelBuilder.Entity<WholesalePricing>(e =>
        {
            e.HasIndex(wp => wp.ProductId);
            e.HasOne(wp => wp.Product).WithMany(p => p.WholesalePricings).HasForeignKey(wp => wp.ProductId);
            e.HasOne(wp => wp.Wholesaler).WithMany(w => w.WholesalePricings).HasForeignKey(wp => wp.WholesalerId);
        });

        // RFQ Request
        modelBuilder.Entity<RfqRequest>(e =>
        {
            e.HasIndex(r => r.CustomerId);
            e.HasIndex(r => r.WholesalerId);
            e.HasOne(r => r.Customer).WithMany().HasForeignKey(r => r.CustomerId);
            e.HasOne(r => r.Wholesaler).WithMany(w => w.RfqRequests).HasForeignKey(r => r.WholesalerId);
            e.HasOne(r => r.Product).WithMany().HasForeignKey(r => r.ProductId);
        });

        // Customer Wallet
        modelBuilder.Entity<CustomerWallet>(e =>
        {
            e.HasIndex(w => w.UserId).IsUnique();
            e.HasOne(w => w.User).WithOne(u => u.CustomerWallet).HasForeignKey<CustomerWallet>(w => w.UserId);
        });

        // Reward Points
        modelBuilder.Entity<RewardPoint>(e =>
        {
            e.HasIndex(r => r.UserId);
            e.HasOne(r => r.User).WithMany(u => u.RewardPoints).HasForeignKey(r => r.UserId);
        });

        // Gift Card
        modelBuilder.Entity<GiftCard>(e =>
        {
            e.HasIndex(g => g.Code).IsUnique();
            e.HasOne(g => g.Buyer).WithMany().HasForeignKey(g => g.BuyerId);
        });

        // Audit Log
        modelBuilder.Entity<AuditLog>(e =>
        {
            e.HasIndex(a => a.UserId);
            e.HasIndex(a => new { a.EntityType, a.EntityId });
            e.HasOne(a => a.User).WithMany(u => u.AuditLogs).HasForeignKey(a => a.UserId);
        });

        // Feature Flag
        modelBuilder.Entity<FeatureFlag>(e =>
        {
            e.HasIndex(f => f.Name).IsUnique();
        });

        // API Key
        modelBuilder.Entity<ApiKey>(e =>
        {
            e.HasIndex(k => k.UserId);
            e.HasOne(k => k.User).WithMany(u => u.ApiKeys).HasForeignKey(k => k.UserId);
        });
    }
}
