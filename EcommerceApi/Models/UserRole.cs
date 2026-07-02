namespace EcommerceApi.Models;

public enum UserRole { Customer, Vendor, Wholesaler, Admin, SuperAdmin }
public enum ProductStatus { Draft, Active }
public enum PaymentStatus { Pending, Paid, Failed, Refunded }
public enum FulfillmentStatus { Pending, Processing, Shipped, Delivered, Cancelled }
public enum CouponType { Percentage, Fixed }
public enum VendorStatus { Pending, Approved, Suspended, Rejected }
public enum WholesalerStatus { Pending, Approved, Suspended, Rejected }
public enum VerificationStatus { Unverified, Pending, Verified, Rejected }
