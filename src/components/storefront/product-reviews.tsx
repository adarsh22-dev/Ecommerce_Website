"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/contexts/auth-context";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null };
}

interface ProductReviewsProps {
  productId: string;
  reviewCount?: number;
  averageRating?: number;
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-32 w-full" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  reviewCount: _initialCount,
  averageRating: _initialRating,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const limit = 5;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { getProductReviews } = await import("@/lib/services/products");
      const result = await getProductReviews(productId, page, limit);
      setReviews(result.reviews as Review[]);
      setTotalCount(result.total);

      // Calculate rating breakdown from all reviews
      const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      if (result.total > 0) {
        // In production, fetch breakdown from a dedicated query
        // For now, derive from current reviews
        result.reviews.forEach((r: Review) => {
          breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
        });
      }
      setRatingBreakdown(breakdown);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (formRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: formRating,
        title: formTitle || null,
        body: formBody || null,
        is_verified: false,
      });

      if (error) throw error;

      toast.success("Review submitted! Thank you for your feedback.");
      setShowForm(false);
      setFormRating(0);
      setFormTitle("");
      setFormBody("");
      fetchReviews();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Row */}
      <div className="flex flex-col sm:flex-row items-start gap-8 p-6 bg-muted rounded-xl">
        {/* Average */}
        <div className="text-center">
          <p className="text-4xl font-bold text-foreground">
            {averageRating > 0 ? averageRating.toFixed(1) : "—"}
          </p>
          <div className="flex items-center gap-0.5 mt-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            {totalCount} review{totalCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Breakdown */}
        <div className="flex-1 w-full space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown[star] || 0;
            const max = Math.max(...Object.values(ratingBreakdown), 1);
            const pct = max > 0 ? (count / max) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-xs text-foreground-secondary w-4">{star}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-foreground-secondary w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Write Review Button */}
        <Button
          variant="secondary"
          onClick={() => {
            if (!user) {
              toast.error("Please sign in to leave a review");
              return;
            }
            setShowForm(!showForm);
          }}
          className="flex-shrink-0"
        >
          Write a Review
        </Button>
      </div>

      {/* Submit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmitReview}
            className="overflow-hidden"
          >
            <div className="card p-6 space-y-4">
              <h3 className="font-semibold">Write Your Review</h3>

              {/* Star Selector */}
              <div>
                <p className="text-sm text-foreground-secondary mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground-secondary mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Summary of your review"
                  className="flex h-10 w-full rounded-lg border border-border bg-white px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Textarea
                label="Review"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Tell others about your experience..."
                required
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="shimmer-btn" loading={submitting}>
                  Submit Review
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <ReviewsSkeleton />
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-foreground-secondary">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-sm font-medium text-primary">
                    {review.profiles?.full_name?.[0] || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {review.profiles?.full_name || "Anonymous"}
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {review.title}
                </h4>
              )}
              {review.body && (
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  {review.body}
                </p>
              )}
              {review.is_verified && (
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <span className="text-xs text-success font-medium">
                    Verified Purchase
                  </span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-foreground-secondary px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
