"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { OrderWithDetails } from "@/lib/types";

const statusColors: Record<string, "success" | "warning" | "primary" | "neutral" | "destructive"> = {
  pending: "warning", processing: "primary", shipped: "primary",
  delivered: "success", cancelled: "destructive",
  paid: "success", failed: "destructive", refunded: "warning",
};

const statusFlow = ["pending", "processing", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { adminGetOrders } = await import("@/lib/services/admin");
      const result = await adminGetOrders({});
      setOrders(result.orders);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase
        .from("orders")
        .update({ fulfillment_status: status, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      if (error) throw error;
      toast.success(`Order marked as ${status}`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, fulfillment_status: status as any } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, fulfillment_status: status as any });
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch = !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      (o as any).profiles?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.fulfillment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const currentStatusIndex = (status: string) => statusFlow.indexOf(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          {loading ? "Loading..." : `${orders.length} total orders`}
        </p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:w-auto flex items-center gap-2 bg-muted/70 rounded-lg px-3 py-2 focus-within:bg-muted focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-foreground-secondary flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by order # or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Status</option>
            {statusFlow.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-foreground-secondary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">No orders found</p>
            <p className="text-sm text-foreground-secondary">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th className="hidden sm:table-cell">Customer</th>
                  <th className="hidden md:table-cell">Items</th>
                  <th>Total</th>
                  <th className="hidden sm:table-cell">Payment</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div>
                        <p className="text-sm font-medium">{order.order_number || "—"}</p>
                        <p className="text-xs text-foreground-secondary">{formatDate(order.created_at)}</p>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <p className="text-sm">{(order as any).profiles?.full_name || "Customer"}</p>
                      <p className="text-xs text-foreground-secondary">{order.email}</p>
                    </td>
                    <td className="hidden md:table-cell text-sm">{(order as any).order_items?.length || 0} items</td>
                    <td className="text-sm font-medium">{formatCurrency(order.total)}</td>
                    <td className="hidden sm:table-cell">
                      <Badge variant={statusColors[order.payment_status]}>{order.payment_status}</Badge>
                    </td>
                    <td>
                      <Badge variant={statusColors[order.fulfillment_status]}>{order.fulfillment_status}</Badge>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-foreground-secondary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-foreground-secondary">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={selectedOrder?.order_number || "Order Details"} size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-foreground-secondary mb-1">Customer</p>
                <p className="text-sm font-medium">{(selectedOrder as any).profiles?.full_name || "Customer"}</p>
                <p className="text-xs text-foreground-secondary">{selectedOrder.email}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-foreground-secondary mb-1">Status</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant={statusColors[selectedOrder.fulfillment_status]}>{selectedOrder.fulfillment_status}</Badge>
                  <Badge variant={statusColors[selectedOrder.payment_status]}>{selectedOrder.payment_status}</Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">
                Total: <span className="text-lg text-primary">{formatCurrency(selectedOrder.total)}</span>
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3">Update Fulfillment Status</p>
              <div className="flex flex-wrap gap-2">
                {statusFlow.map((status) => {
                  const isCurrent = selectedOrder.fulfillment_status === status;
                  const isPast = currentStatusIndex(selectedOrder.fulfillment_status) >= currentStatusIndex(status);
                  return (
                    <Button
                      key={status}
                      variant={isCurrent ? "primary" : isPast ? "secondary" : "secondary"}
                      size="sm"
                      onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      loading={updatingStatus}
                      disabled={isCurrent}
                      className={isPast && !isCurrent ? "opacity-60" : ""}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  );
                })}
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-destructive border-destructive/30"
                  onClick={() => handleStatusUpdate(selectedOrder.id, "cancelled")}
                  loading={updatingStatus}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
