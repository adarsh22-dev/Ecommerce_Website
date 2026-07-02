"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  MoreVertical,
  TrendingUp,
  Package,
  Star,
  Shield,
} from "lucide-react";
import { VendorProfile, VENDOR_STATUS_COLORS } from "@/lib/types";

const mockVendors: VendorProfile[] = [
  {
    id: "1",
    user_id: "u1",
    business_name: "TechWorld Electronics",
    business_description: "Premium electronics and gadgets",
    business_logo_url: null,
    business_address: "123 Tech Street, Bangalore",
    business_phone: "+91 98765 43210",
    business_email: "info@techworld.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    bank_account_number: null,
    bank_ifsc: null,
    bank_name: null,
    commission_rate: 10,
    status: "approved",
    verification_status: "verified",
    rating: 4.5,
    total_sales: 125000,
    total_orders: 342,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    user_id: "u2",
    business_name: "Fashion Hub",
    business_description: "Trendy fashion and accessories",
    business_logo_url: null,
    business_address: "456 Fashion Ave, Mumbai",
    business_phone: "+91 87654 32109",
    business_email: "contact@fashionhub.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    bank_account_number: null,
    bank_ifsc: null,
    bank_name: null,
    commission_rate: 12,
    status: "pending",
    verification_status: "pending",
    rating: null,
    total_sales: 0,
    total_orders: 0,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    user_id: "u3",
    business_name: "Home Essentials",
    business_description: "Home decor and kitchen appliances",
    business_logo_url: null,
    business_address: "789 Home Lane, Delhi",
    business_phone: "+91 76543 21098",
    business_email: "support@homeessentials.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    bank_account_number: null,
    bank_ifsc: null,
    bank_name: null,
    commission_rate: 15,
    status: "approved",
    verification_status: "verified",
    rating: 4.2,
    total_sales: 89000,
    total_orders: 198,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    user_id: "u4",
    business_name: "Sports Arena",
    business_description: "Sports equipment and fitness gear",
    business_logo_url: null,
    business_address: "321 Sports Blvd, Chennai",
    business_phone: "+91 65432 10987",
    business_email: "info@sportsarena.com",
    tax_id: null,
    gst_number: null,
    pan_number: null,
    bank_account_number: null,
    bank_ifsc: null,
    bank_name: null,
    commission_rate: 8,
    status: "suspended",
    verification_status: "verified",
    rating: 3.8,
    total_sales: 45000,
    total_orders: 87,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorProfile[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.business_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "approved" as const, verification_status: "verified" as const }
          : v
      )
    );
  };

  const handleSuspend = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "suspended" as const } : v))
    );
  };

  const stats = {
    total: vendors.length,
    approved: vendors.filter((v) => v.status === "approved").length,
    pending: vendors.filter((v) => v.status === "pending").length,
    totalRevenue: vendors.reduce((sum, v) => sum + v.total_sales, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage marketplace vendors and their approvals
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
          + Add Vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-foreground-secondary">Total Vendors</p>
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
              <p className="text-xs text-foreground-secondary">Total Revenue</p>
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
              placeholder="Search vendors..."
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
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Vendor
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Verification
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Commission
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Sales
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <motion.tr
                  key={vendor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{vendor.business_name}</p>
                      <p className="text-xs text-foreground-secondary">{vendor.business_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        VENDOR_STATUS_COLORS[vendor.status]
                      }`}
                    >
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      {vendor.verification_status === "verified" ? (
                        <Shield className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-yellow-600" />
                      )}
                      <span className="capitalize">{vendor.verification_status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{vendor.commission_rate}%</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${(vendor.total_sales / 1000).toFixed(1)}K
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{vendor.total_orders}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{vendor.rating?.toFixed(1) || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setShowDetails(true);
                        }}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-foreground-secondary" />
                      </button>
                      {vendor.status === "pending" && (
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      {vendor.status === "approved" && (
                        <button
                          onClick={() => handleSuspend(vendor.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Suspend"
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
        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-foreground-secondary/30 mx-auto mb-3" />
            <p className="text-foreground-secondary">No vendors found</p>
          </div>
        )}
      </div>

      {/* Vendor Details Modal */}
      <AnimatePresence>
        {showDetails && selectedVendor && (
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
                      {selectedVendor.business_name}
                    </h2>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {selectedVendor.business_description}
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
                      <p className="font-medium capitalize">{selectedVendor.status}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Commission</p>
                      <p className="font-medium">{selectedVendor.commission_rate}%</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Total Sales</p>
                      <p className="font-medium">
                        ${selectedVendor.total_sales.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Total Orders</p>
                      <p className="font-medium">{selectedVendor.total_orders}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Contact Information</h3>
                    <p className="text-sm text-foreground-secondary">
                      📧 {selectedVendor.business_email}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      📱 {selectedVendor.business_phone}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      📍 {selectedVendor.business_address}
                    </p>
                  </div>

                  {selectedVendor.status === "pending" && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          handleApprove(selectedVendor.id);
                          setShowDetails(false);
                        }}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Approve Vendor
                      </button>
                      <button
                        onClick={() => {
                          handleSuspend(selectedVendor.id);
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
