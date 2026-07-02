export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative w-10 h-10 mx-auto mb-4">
          <div className="absolute inset-0 border-3 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-3 border-primary rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-foreground-secondary">Loading...</p>
      </div>
    </div>
  );
}
