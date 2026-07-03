"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, CheckCircle, XCircle, Clock, Eye, Search, TrendingUp, Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Profile } from "@/lib/types";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<Profile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["vendor"])
        .order("created_at", { ascending: false });
      setVendors(data || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const updateStatus = async (id: string, status: Profile["status"]) => {
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
      if (error) throw error;
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      toast.success(`Vendor ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "suspended"}`);
      setShowDetails(false);
    } catch {
      toast.error("Failed to update vendor status");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      (v.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const s = (v as any).status || "approved";
    const matchesStatus = statusFilter === "all" || s === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    pending: vendors.filter((v) => (v as any).status === "pending").length,
    approved: vendors.filter((v) => !(v as any).status || (v as any).status === "approved").length,
  };

  const getStatus = (v: Profile) => (v as any).status || "approved";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Approve, suspend, and manage vendor accounts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-foreground-secondary">Pending Approval</p>
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
      </div>

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
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">Joined</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-foreground-secondary">Loading...</td></tr>
              ) : filteredVendors.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12">
                  <Store className="w-12 h-12 text-foreground-secondary/30 mx-auto mb-3" />
                  <p className="text-foreground-secondary">No vendors found</p>
                </td></tr>
              ) : filteredVendors.map((vendor) => {
                const status = getStatus(vendor);
                return (
                  <motion.tr key={vendor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{vendor.full_name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground-secondary">{vendor.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        status === "rejected" || status === "suspended" ? "bg-red-100 text-red-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground-secondary">
                      {new Date(vendor.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedVendor(vendor); setShowDetails(true); }}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4 text-foreground-secondary" />
                        </button>
                        {status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(vendor.id, "approved")}
                              className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button onClick={() => updateStatus(vendor.id, "rejected")}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                        {status === "approved" && (
                          <button onClick={() => updateStatus(vendor.id, "suspended")}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Suspend">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                        {(status === "suspended" || status === "rejected") && (
                          <button onClick={() => updateStatus(vendor.id, "approved")}
                            className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Re-activate">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && selectedVendor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowDetails(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedVendor.full_name}</h2>
                    <p className="text-sm text-foreground-secondary mt-1">{selectedVendor.email}</p>
                  </div>
                  <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-muted rounded-lg">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Status</p>
                      <p className="font-medium capitalize">{getStatus(selectedVendor)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Role</p>
                      <p className="font-medium capitalize">{selectedVendor.role}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Joined</p>
                      <p className="font-medium">{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-foreground-secondary">Last Updated</p>
                      <p className="font-medium">{new Date(selectedVendor.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatus(selectedVendor) === "pending" && (
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => updateStatus(selectedVendor.id, "approved")}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Approve Vendor
                      </button>
                      <button onClick={() => updateStatus(selectedVendor.id, "rejected")}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
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
