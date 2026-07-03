"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  History, Search, Filter, User, Package, ShoppingCart, Store, Building2,
  Settings, Shield, DollarSign, Tag, FileText, Clock,
} from "lucide-react";

interface ActivityEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: string;
  userRole: string;
  timestamp: string;
  type: "vendor" | "wholesaler" | "product" | "order" | "settings" | "user" | "coupon";
}

const mockActivities: ActivityEntry[] = [
  { id: "1", action: "approved", entity: "vendor", entityId: "TechWorld Electronics", user: "Admin", userRole: "super_admin", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "vendor" },
  { id: "2", action: "updated commission rate", entity: "vendor", entityId: "Home Essentials", user: "Admin", userRole: "admin", timestamp: new Date(Date.now() - 7200000).toISOString(), type: "vendor" },
  { id: "3", action: "suspended", entity: "vendor", entityId: "Sports Arena", user: "Admin", userRole: "super_admin", timestamp: new Date(Date.now() - 14400000).toISOString(), type: "vendor" },
  { id: "4", action: "approved credit limit increase", entity: "wholesaler", entityId: "Global Trade Corp", user: "Admin", userRole: "admin", timestamp: new Date(Date.now() - 86400000).toISOString(), type: "wholesaler" },
  { id: "5", action: "updated", entity: "product", entityId: "Hydraulic Cylinder HC-200", user: "Vendor", userRole: "vendor", timestamp: new Date(Date.now() - 172800000).toISOString(), type: "product" },
  { id: "6", action: "created", entity: "coupon", entityId: "SUMMER24", user: "Admin", userRole: "admin", timestamp: new Date(Date.now() - 259200000).toISOString(), type: "coupon" },
  { id: "7", action: "changed status to shipped", entity: "order", entityId: "ORD-1040", user: "System", userRole: "system", timestamp: new Date(Date.now() - 345600000).toISOString(), type: "order" },
  { id: "8", action: "updated payout method", entity: "vendor", entityId: "Fashion Hub", user: "Vendor", userRole: "vendor", timestamp: new Date(Date.now() - 432000000).toISOString(), type: "vendor" },
  { id: "9", action: "registered", entity: "wholesaler", entityId: "Prime Distributors", user: "Prime Distributors", userRole: "wholesaler", timestamp: new Date(Date.now() - 518400000).toISOString(), type: "wholesaler" },
  { id: "10", action: "modified homepage sections", entity: "settings", entityId: "Homepage", user: "Admin", userRole: "admin", timestamp: new Date(Date.now() - 604800000).toISOString(), type: "settings" },
];

const typeIcons: Record<string, React.ElementType> = {
  vendor: Store, wholesaler: Building2, product: Package,
  order: ShoppingCart, settings: Settings, user: User, coupon: Tag,
};

const typeColors: Record<string, string> = {
  vendor: "bg-blue-100 text-blue-600",
  wholesaler: "bg-purple-100 text-purple-600",
  product: "bg-green-100 text-green-600",
  order: "bg-orange-100 text-orange-600",
  settings: "bg-gray-100 text-gray-600",
  user: "bg-cyan-100 text-cyan-600",
  coupon: "bg-pink-100 text-pink-600",
};

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = mockActivities.filter(a => {
    const matchesSearch =
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.entityId.toLowerCase().includes(search.toLowerCase()) ||
      a.user.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Track all actions across the platform
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Types</option>
            <option value="vendor">Vendor</option>
            <option value="wholesaler">Wholesaler</option>
            <option value="product">Product</option>
            <option value="order">Order</option>
            <option value="coupon">Coupon</option>
            <option value="settings">Settings</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((entry, i) => {
          const Icon = typeIcons[entry.type];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-white rounded-xl border border-border p-4 flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[entry.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      <span className="capitalize">{entry.entity}</span>{" "}
                      <span className="text-foreground-secondary">&ldquo;{entry.entityId}&rdquo;</span>{" "}
                      <span className="text-foreground-secondary">{entry.action}</span>
                    </p>
                    <p className="text-xs text-foreground-secondary mt-0.5">
                      by <span className="font-medium">{entry.user}</span>{" "}
                      <span className="capitalize">({entry.userRole})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-foreground-secondary flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-foreground-secondary/30 mx-auto mb-3" />
            <p className="text-foreground-secondary">No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}