export default function ReturnsPolicyPage() {
  return (
    <div className="section-padding">
      <div className="container-xl max-w-3xl">
        <h1 className="font-serif text-section-heading text-foreground mb-8">Return Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-foreground-secondary">
          <h2 className="font-serif text-xl text-foreground">30-Day Returns</h2>
          <p>We want you to love your purchase. If you&apos;re not completely satisfied, you can return most items within 30 days of delivery for a full refund.</p>
          <h2 className="font-serif text-xl text-foreground">How to Return</h2>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Contact our support team to initiate your return</li>
            <li>Receive your prepaid return shipping label</li>
            <li>Pack the item in its original packaging</li>
            <li>Drop off at your nearest shipping location</li>
            <li>Refund processed within 5-7 business days of receipt</li>
          </ol>
          <h2 className="font-serif text-xl text-foreground">Conditions</h2>
          <p>Items must be unworn, unwashed, and in original packaging with all tags attached. Sale items are eligible for return within 14 days.</p>
        </div>
      </div>
    </div>
  );
}
