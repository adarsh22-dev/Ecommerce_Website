"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  TrendingUp,
  FileText,
  DollarSign,
  Shield,
  Package,
} from "lucide-react";
import { WholesalerProfile } from "@/lib/types";

const mockWholesalers: WholesalerProfile[] = [
  {
    id: "1",
    user_id: "u5",
    business_name: "Global Trade Corp",
    business_description: "Wholesale electronics and accessories",
    business_logo_url: null,
    business_address: "100 Trade Center, Mumbai",
    business_phone: "+91 91111 22222",
    business_email: "sales@globaltrade.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    min_order_amount: 5000,
    credit_limit: 200000,
    credit_used: 45000,
    payment_terms_days: 30,
    status: "approved",
    verification_status: "verified",
    rating: 4.7,
    total_sales: 560000,
    total_orders: 89,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "2",
    user_id: "u6",
    business_name: "BulkMart Wholesale",
    business_description: "FMCG and consumer goods distributor",
    business_logo_url: null,
    business_address: "200 Distribution Hub, Delhi",
    business_phone: "+91 82222 33333",
    business_email: "orders@bulkmart.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    min_order_amount: 10000,
    credit_limit: 500000,
    credit_used: 120000,
    payment_terms_days: 45,
    status: "approved",
    verification_status: "verified",
    rating: 4.3,
    total_sales: 890000,
    total_orders: 156,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    user_id: "u7",
    business_name: "Prime Distributors",
    business_description: "Fashion and textile wholesaler",
    business_logo_url: null,
    business_address: "50 Textile Market, Surat",
    business_phone: "+91 73333 44444",
    business_email: "info@primedist.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    min_order_amount: 2000,
    credit_limit: 100000,
    credit_used: 0,
    payment_terms_days: 30,
    status: "pending",
    verification_status: "pending",
    rating: null,
    total_sales: 0,
    total_orders: 0,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export default function WholesalersPage() {
  const [wholesalers, setWholesalers] = useState<WholesalerProfile[]>(mockWholesalers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedWholesaler, setSelectedWholesaler] = useState<WholesalerProfile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filtered = wholesalers.filter((w) => {
    const matchesSearch =
      w.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.business_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setWholesalers((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: "approved" as const, verification_status: "verified" as const }
          : w
      )
    );
  };

  const handleSuspend = (id: string) => {
    setWholesalers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "suspended" as const } : w))
    );
  };

  const stats = {
    total: wholesalers.length,
    approved: wholesalers.filter((w) => w.status === "approved").length,
    pending: wholesalers.filter((w) => w.status === "pending").length,
    totalRevenue: wholesalers.reduce((sum, w) => sum + w.total_sales, 0),
    totalCredit: wholesalers.reduce((sum, w) => sum + w.credit_limit, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wholesaler Management</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage B2B wholesalers, credit limits, and RFQ negotiations
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
          + Add Wholesaler
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-foreground-secondary">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
              <p className="text-xs text-foreground-secondary">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-foreground-secondary">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${(stats.totalRevenue / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-foreground-secondary">Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${(stats.totalCredit / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-foreground-secondary">Credit Limit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search wholesalers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Wholesalers Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Wholesaler
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Min Order
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Credit
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Terms
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Sales
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <motion.tr
                  key={w.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{w.business_name}</p>
                      <p className="text-xs text-foreground-secondary">{w.business_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        w.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : w.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    ${w.min_order_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        ${w.credit_used.toLocaleString()} / ${w.credit_limit.toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min((w.credit_used / w.credit_limit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{w.payment_terms_days} days</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${(w.total_sales / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedWholesaler(w);
                          setShowDetails(true);
                        }}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-foreground-secondary" />
                      </button>
                      {w.status === "pending" && (
                        <button
                          onClick={() => handleApprove(w.id)}
                          className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      {w.status === "approved" && (
                        <button
                          onClick={() => handleSuspend(w.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-foreground-secondary/30 mx-auto mb-3" />
            <p className="text-foreground-secondary">No wholesalers found</p>
          </div>
        )}
      </div>

      {/* Wholesaler Details Modal */}
      <AnimatePresence>
        {showDetails && selectedWholesaler && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {selectedWholesaler.business_name}
                    </h2>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {selectedWholesaler.business_description}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Status</p>
                      <p className="font-medium capitalize">{selectedWholesaler.status}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Min Order</p>
                      <p className="font-medium">
                        ${selectedWholesaler.min_order_amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Credit Used</p>
                      <p className="font-medium">
                        ${selectedWholesaler.credit_used.toLocaleString()} / $
                        {selectedWholesaler.credit_limit.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Payment Terms</p>
                      <p className="font-medium">{selectedWholesaler.payment_terms_days} days</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Contact Information</h3>
                    <p className="text-sm text-foreground-secondary">
                      📧 {selectedWholesaler.business_email}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      📱 {selectedWholesaler.business_phone}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      📍 {selectedWholesaler.business_address}
                    </p>
                  </div>

                  {selectedWholesaler.status === "pending" && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          handleApprove(selectedWholesaler.id);
                          setShowDetails(false);
                        }}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Approve Wholesaler
                      </button>
                      <button
                        onClick={() => {
                          handleSuspend(selectedWholesaler.id);
                          setShowDetails(false);
                        }}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
