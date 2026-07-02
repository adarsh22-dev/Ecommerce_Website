"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Coupon } from "@/lib/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    min_order_amount: "",
    usage_limit: "",
    per_customer_limit: "",
    valid_from: "",
    valid_to: "",
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCoupons(data || []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm({
      code: "",
      type: "percentage",
      value: "",
      min_order_amount: "",
      usage_limit: "",
      per_customer_limit: "",
      valid_from: "",
      valid_to: "",
    });
    setShowModal(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      min_order_amount: coupon.min_order_amount?.toString() || "",
      usage_limit: coupon.usage_limit?.toString() || "",
      per_customer_limit: coupon.per_customer_limit?.toString() || "",
      valid_from: coupon.valid_from ? coupon.valid_from.split("T")[0] : "",
      valid_to: coupon.valid_to ? coupon.valid_to.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!form.value || parseFloat(form.value) <= 0) {
      toast.error("Discount value is required");
      return;
    }

    setSaving(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const data = {
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: parseFloat(form.value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        per_customer_limit: form.per_customer_limit ? parseInt(form.per_customer_limit) : null,
        valid_from: form.valid_from || null,
        valid_to: form.valid_to || null,
        is_active: true,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from("coupons")
          .update(data)
          .eq("id", editingCoupon.id);
        if (error) throw error;
        toast.success("Coupon updated");
      } else {
        const { error } = await supabase.from("coupons").insert(data);
        if (error) {
          if (error.code === "23505") {
            toast.error("A coupon with this code already exists");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Coupon created");
      }
      setShowModal(false);
      fetchCoupons();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCoupon) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.from("coupons").delete().eq("id", deletingCoupon.id);
      if (error) throw error;
      toast.success("Coupon deleted");
      setShowDeleteModal(false);
      setDeletingCoupon(null);
      fetchCoupons();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete coupon");
    }
  };

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            {loading ? "Loading..." : `${coupons.length} coupons`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <Button onClick={openCreate} className="shimmer-btn">
            <Plus className="w-4 h-4" /> Add Coupon
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-border">
          <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
            <Tag className="w-6 h-6 text-foreground-secondary" />
          </div>
          <p className="text-lg font-medium text-foreground mb-1">
            {search ? "No coupons found" : "No coupons yet"}
          </p>
          <p className="text-sm text-foreground-secondary mb-6">
            {search ? "Try a different search term" : "Create your first coupon to offer discounts"}
          </p>
          {!search && (
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" /> Add Coupon
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-mono font-semibold text-lg">{coupon.code}</span>
                </div>
                <Badge variant={coupon.is_active ? "success" : "neutral"}>
                  {coupon.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Discount</span>
                  <span className="font-medium">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Min. Order</span>
                  <span>{coupon.min_order_amount ? `$${coupon.min_order_amount}` : "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Used</span>
                  <span>{coupon.times_used} / {coupon.usage_limit || "∞"}</span>
                </div>
                {coupon.valid_from && (
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Valid</span>
                    <span className="text-xs">
                      {formatDate(coupon.valid_from)}
                      {coupon.valid_to ? ` — ${formatDate(coupon.valid_to)}` : ""}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEdit(coupon)}
                >
                  <Edit className="w-3 h-3" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setDeletingCoupon(coupon);
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCoupon ? "Edit Coupon" : "Add Coupon"}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Coupon Code *"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g., SPRING25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Type *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
              className="flex h-12 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <Input
            label="Discount Value *"
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder={form.type === "percentage" ? "10" : "20"}
          />
          <Input
            label="Min. Order Amount"
            type="number"
            value={form.min_order_amount}
            onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
            placeholder="50"
          />
          <Input
            label="Usage Limit"
            type="number"
            value={form.usage_limit}
            onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
            placeholder="100"
          />
          <Input
            label="Per Customer Limit"
            type="number"
            value={form.per_customer_limit}
            onChange={(e) => setForm({ ...form, per_customer_limit: e.target.value })}
            placeholder="1"
          />
          <Input
            label="Valid From"
            type="date"
            value={form.valid_from}
            onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
          />
          <Input
            label="Valid To"
            type="date"
            value={form.valid_to}
            onChange={(e) => setForm({ ...form, valid_to: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving} className="shimmer-btn">
            {editingCoupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Coupon"
        size="sm"
      >
        <p className="text-sm text-foreground-secondary mb-2">
          Delete coupon <strong className="text-foreground font-mono">{deletingCoupon?.code}</strong>?
        </p>
        <p className="text-xs text-destructive mb-6">
          This action cannot be undone. Customers using this coupon will no longer be able to apply it.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
