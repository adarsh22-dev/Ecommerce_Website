export default function ShippingPolicyPage() {
  return (
    <div className="section-padding">
      <div className="container-xl max-w-3xl">
        <h1 className="font-serif text-section-heading text-foreground mb-8">Shipping Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-foreground-secondary">
          <h2 className="font-serif text-xl text-foreground">Shipping Methods</h2>
          <ul className="space-y-2">
            <li><strong className="text-foreground">Standard Shipping (5-7 business days):</strong> Free on orders over $100, otherwise $10</li>
            <li><strong className="text-foreground">Express Shipping (2-3 business days):</strong> $15 flat rate</li>
          </ul>
          <h2 className="font-serif text-xl text-foreground">International Shipping</h2>
          <p>We ship to over 50 countries. International shipping rates are calculated at checkout based on destination and weight.</p>
          <h2 className="font-serif text-xl text-foreground">Order Processing</h2>
          <p>Orders placed before 2:00 PM EST are processed the same business day. Orders placed after this time will be processed the next business day.</p>
          <h2 className="font-serif text-xl text-foreground">Tracking</h2>
          <p>You will receive a tracking number via email once your order has shipped. Track your package in real-time through our order tracking page.</p>
        </div>
      </div>
    </div>
  );
}
