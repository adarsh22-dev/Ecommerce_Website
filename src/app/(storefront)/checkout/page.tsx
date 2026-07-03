"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, CreditCard, Truck, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import toast from "react-hot-toast";
import type { ProductWithDetails } from "@/lib/types";

type Step = "shipping" | "payment" | "review";

const steps = [
  { id: "shipping" as Step, label: "Shipping", icon: Truck },
  { id: "payment" as Step, label: "Payment", icon: CreditCard },
  { id: "review" as Step, label: "Review", icon: Package },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [crossSellProducts, setCrossSellProducts] = useState<ProductWithDetails[]>([]);
  const [gstNumber, setGstNumber] = useState("");
  const [taxRate, setTaxRate] = useState(8);
  const [taxInclusive, setTaxInclusive] = useState(false);
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const shippingCost = shippingMethod === "express" ? 15 : subtotal > 100 ? 0 : 10;
  const tax = taxInclusive ? 0 : subtotal * (taxRate / 100);
  const halfTax = tax / 2;
  const total = subtotal + shippingCost + tax - couponDiscount;

  useEffect(() => {
    (async () => {
      try {
        const { getSiteSettings } = await import("@/lib/services/products");
        const settings = await getSiteSettings();
        setTaxRate(settings.tax_rate || 8);
        setTaxInclusive(settings.tax_inclusive || false);
      } catch { /* silent */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { getCrossSellProducts } = await import("@/lib/services/products");
        const excludedIds = items.map((i) => i.product.id);
        const all = getCrossSellProducts("", 6) as ProductWithDetails[];
        setCrossSellProducts(all.filter((p) => !excludedIds.includes(p.id)).slice(0, 4));
      } catch { /* silent */ }
    })();
  }, [items]);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { validateCoupon } = await import("@/lib/services/admin");
      const result = await validateCoupon(couponCode, subtotal, user?.id || "");
      if (result.valid && result.discount) {
        setCouponDiscount(result.discount);
        setCouponMessage(`Coupon applied! You save ${formatCurrency(result.discount)}`);
        toast.success("Coupon applied!");
      } else {
        setCouponDiscount(0);
        setCouponMessage(result.error || "Invalid coupon");
        toast.error(result.error || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to validate coupon");
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }

    setProcessing(true);

    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          email: shipping.email || user.email,
          shipping_address: {
            full_name: shipping.fullName,
            phone: shipping.phone,
            address_line1: shipping.address1,
            address_line2: shipping.address2,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
          billing_address: null,
          shipping_method: shippingMethod,
          shipping_cost: shippingCost,
          subtotal,
          discount_amount: couponDiscount,
          tax_amount: tax,
          total,
          coupon_code: couponCode || null,
          gst_number: gstNumber || null,
          payment_status: "pending",
          fulfillment_status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        title: item.product.title,
        variant_info: item.selectedOptions || null,
        quantity: item.quantity,
        unit_price: item.variant?.price || item.product.sale_price || item.product.price,
        line_total: (item.variant?.price || item.product.sale_price || item.product.price) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_PUBLISHABLE_KEY;

      if (razorpayKey) {
        const createRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            currency: "INR",
            receipt: `order_${order.id}`,
          }),
        });

        const razorpayOrder = await createRes.json();
        if (!createRes.ok) throw new Error(razorpayOrder.error || "Failed to create payment");

        await supabase
          .from("orders")
          .update({ razorpay_order_id: razorpayOrder.razorpay_order_id })
          .eq("id", order.id);

        await loadRazorpayScript();

        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "ECOM",
          description: `Order ${order.id}`,
          order_id: razorpayOrder.razorpay_order_id,
          prefill: {
            name: shipping.fullName || profile?.full_name,
            email: shipping.email || user.email,
            contact: shipping.phone || "",
          },
          theme: { color: "#2563EB" },
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              toast.error("Payment verification failed. Contact support with your order ID.");
              return;
            }

            await supabase
              .from("orders")
              .update({
                payment_status: "paid",
                razorpay_payment_id: response.razorpay_payment_id,
                updated_at: new Date().toISOString(),
              })
              .eq("id", order.id);

            await supabase.from("order_timeline").insert({
              order_id: order.id,
              status: "pending",
              note: "Order placed successfully via Razorpay",
              created_by: user.id,
            });

            clearCart();
            router.push(`/order-confirmation?id=${order.id}`);
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled. Your order is saved as pending.");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        await supabase.from("order_timeline").insert({
          order_id: order.id,
          status: "pending",
          note: "Order placed successfully (demo — no Razorpay key)",
          created_by: user.id,
        });

        clearCart();
        router.push(`/order-confirmation?id=${order.id}`);
        toast.success("Order placed! (Demo mode — add Razorpay keys to go live)");
      }
    } catch (err: any) {
      console.error("Order error:", err);
      toast.error(err?.message || "Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.head.appendChild(script);
    });
  }

  return (
    <div className="section-padding">
      <div className="container-xl max-w-4xl">
        <h1 className="font-serif text-section-heading text-foreground mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index < currentStepIndex
                      ? "bg-success text-white"
                      : index === currentStepIndex
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground-secondary"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${
                  index <= currentStepIndex ? "text-foreground" : "text-foreground-secondary"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-px mx-3 ${
                  index < currentStepIndex ? "bg-success" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Input label="Full Name" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} />
                    </div>
                    <Input label="Email" type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} />
                    <Input label="Phone" type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
                    <div className="sm:col-span-2">
                      <Input label="Address Line 1" value={shipping.address1} onChange={(e) => setShipping({ ...shipping, address1: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Address Line 2 (optional)" value={shipping.address2} onChange={(e) => setShipping({ ...shipping, address2: e.target.value })} />
                    </div>
                    <Input label="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                    <Input label="State / Province" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
                    <Input label="ZIP / Postal Code" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
                    <Input label="Country" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                  </div>

                  {/* GST Number */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">GST</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">GST Number (for business invoices)</span>
                    </div>
                    <Input
                      label="GST Number (optional)"
                      placeholder="22AAAAA0000A1Z5"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    />
                    <p className="text-xs text-foreground-secondary mt-1.5">
                      Provide your GST number for a tax invoice. Leave blank for consumer purchases.
                    </p>
                  </div>

                  <h3 className="text-sm font-medium mt-8 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    {[
                      { id: "standard", label: "Standard Shipping", price: subtotal > 100 ? 0 : 10, time: "5-7 business days" },
                      { id: "express", label: "Express Shipping", price: 15, time: "2-3 business days" },
                    ].map((method) => (
                      <label key={method.id} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        shippingMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === method.id ? "border-primary" : "border-border"
                          }`}>
                            {shippingMethod === method.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{method.label}</p>
                            <p className="text-xs text-foreground-secondary">{method.time}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{method.price === 0 ? "Free" : formatCurrency(method.price)}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button onClick={handleNext} className="shimmer-btn">
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Payment</h2>
                  <div className="border border-border rounded-xl p-8 bg-muted/30 text-center">
                    <CreditCard className="w-12 h-12 text-foreground-secondary/30 mx-auto mb-4" />
                    <p className="text-sm text-foreground font-medium mb-2">
                      Razorpay Secure Checkout
                    </p>
                    <p className="text-xs text-foreground-secondary mb-6 max-w-sm mx-auto">
                      You will be redirected to Razorpay&apos;s secure payment page to complete your purchase.
                      We accept Credit/Debit cards, UPI, Net Banking, and Wallets.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1A1A1A" />
                        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">VISA</text>
                      </svg>
                      <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1A1A1A" />
                        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">MC</text>
                      </svg>
                      <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1A1A1A" />
                        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">AMEX</text>
                      </svg>
                      <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1A1A1A" />
                        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">GPAY</text>
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                    <Button onClick={handleNext} className="shimmer-btn">
                      Review Order
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Order Review</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-foreground-secondary mb-1">Shipping to</p>
                      <p className="text-sm font-medium">{shipping.fullName || "John Doe"}</p>
                      <p className="text-sm text-foreground-secondary">{shipping.address1 || "123 Main St"}, {shipping.city || "New York"}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-foreground-secondary mb-1">Shipping Method</p>
                      <p className="text-sm font-medium">{shippingMethod === "express" ? "Express (2-3 days)" : "Standard (5-7 days)"}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-foreground-secondary mb-3">Items ({items.length})</p>
                      {items.map((item) => (
                        <div key={`${item.product.id}-${item.variant?.id}`} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium">{item.product.title}</p>
                            <p className="text-xs text-foreground-secondary">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatCurrency((item.variant?.price || item.product.sale_price || item.product.price) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                    <Button onClick={handlePlaceOrder} className="shimmer-btn" loading={processing}>
                      {processing ? "Processing..." : `Place Order — ${formatCurrency(total)}`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 min-w-0">
            <div className="card p-4 sm:p-6 sticky top-24 space-y-4 overflow-hidden">
              {/* Coupon */}
              <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/60">
                <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2 block">
                  Promo Code
                </label>
                <div className="flex gap-2" style={{ flexDirection: "column" }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 h-10 px-3 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border bg-white text-foreground hover:bg-muted h-8 px-3 text-xs rounded-md gap-1.5 shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-xs mt-2 ${couponDiscount > 0 ? "text-success" : "text-destructive"}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              <hr className="border-border" />

              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Discount</span>
                    <span className="font-medium text-success">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Shipping</span>
                  <span className="font-medium">{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Tax ({taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-xs text-foreground-secondary pl-4">
                    <span>CGST ({taxRate / 2}%)</span>
                    <span>{formatCurrency(halfTax)}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-xs text-foreground-secondary pl-4">
                    <span>SGST ({taxRate / 2}%)</span>
                    <span>{formatCurrency(halfTax)}</span>
                  </div>
                )}
                <hr className="border-border" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {crossSellProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <p className="text-caption text-primary">You might also like</p>
            <h2 className="font-serif text-2xl text-foreground">Complete your purchase</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {crossSellProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
