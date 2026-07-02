"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Store,
  Building2,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Flag,
  LayoutDashboard,
} from "lucide-react";
import { SuperAdminDashboard, FeatureFlag, SystemHealth } from "@/lib/types";

const mockDashboard: SuperAdminDashboard = {
  totalUsers: 12847,
  totalVendors: 156,
  totalWholesalers: 43,
  totalProducts: 8923,
  totalOrders: 45678,
  totalRevenue: 2847560,
  pendingVendors: 8,
  pendingWholesalers: 3,
};

const mockFeatureFlags: FeatureFlag[] = [
  { id: "1", name: "vendor_marketplace", description: "Enable vendor marketplace features", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "2", name: "wholesaler_portal", description: "Enable wholesaler portal features", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "3", name: "ai_assistants", description: "Enable AI assistant features", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "4", name: "advanced_analytics", description: "Enable advanced analytics dashboard", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "5", name: "multi_warehouse", description: "Enable multi-warehouse management", is_enabled: false, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "6", name: "rfq_system", description: "Enable Request for Quote system", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "7", name: "loyalty_program", description: "Enable loyalty and rewards program", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "8", name: "gift_cards", description: "Enable gift card functionality", is_enabled: true, target_roles: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

const mockHealth: SystemHealth[] = [
  { id: "1", service_name: "API Gateway", status: "healthy", response_time_ms: 45, last_check: new Date().toISOString(), details: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "2", service_name: "Database", status: "healthy", response_time_ms: 12, last_check: new Date().toISOString(), details: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", service_name: "Payment Gateway", status: "healthy", response_time_ms: 120, last_check: new Date().toISOString(), details: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "4", service_name: "AI Service", status: "degraded", response_time_ms: 2500, last_check: new Date().toISOString(), details: "High latency detected", created_at: "2024-01-01T00:00:00Z" },
  { id: "5", service_name: "Email Service", status: "healthy", response_time_ms: 230, last_check: new Date().toISOString(), details: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "6", service_name: "Storage", status: "healthy", response_time_ms: 30, last_check: new Date().toISOString(), details: null, created_at: "2024-01-01T00:00:00Z" },
];

// Static Tailwind class maps (JIT-compatible)
const STAT_ICON_BG: Record<string, string> = {
  blue: "bg-blue-100",
  purple: "bg-purple-100",
  orange: "bg-orange-100",
  green: "bg-green-100",
  indigo: "bg-indigo-100",
  emerald: "bg-emerald-100",
  yellow: "bg-yellow-100",
  red: "bg-red-100",
};
const STAT_ICON_TEXT: Record<string, string> = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  green: "text-green-600",
  indigo: "text-indigo-600",
  emerald: "text-emerald-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
};

type Tab = "overview" | "feature-flags" | "system-health" | "audit-logs";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [featureFlags, setFeatureFlags] = useState(mockFeatureFlags);

  const toggleFlag = (id: string) => {
    setFeatureFlags((prev) => prev.map((f) => (f.id === id ? { ...f, is_enabled: !f.is_enabled } : f)));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "feature-flags", label: "Feature Flags", icon: Flag },
    { id: "system-health", label: "System Health", icon: Activity },
    { id: "audit-logs", label: "Audit Logs", icon: Shield },
  ];

  const stats = [
    { label: "Total Users", value: mockDashboard.totalUsers.toLocaleString(), icon: Users, color: "blue" },
    { label: "Vendors", value: mockDashboard.totalVendors.toString(), icon: Store, color: "purple" },
    { label: "Wholesalers", value: mockDashboard.totalWholesalers.toString(), icon: Building2, color: "orange" },
    { label: "Products", value: mockDashboard.totalProducts.toLocaleString(), icon: Package, color: "green" },
    { label: "Orders", value: mockDashboard.totalOrders.toLocaleString(), icon: ShoppingCart, color: "indigo" },
    { label: "Revenue", value: `$${(mockDashboard.totalRevenue / 1000000).toFixed(2)}M`, icon: DollarSign, color: "emerald" },
    { label: "Pending Vendors", value: mockDashboard.pendingVendors.toString(), icon: Clock, color: "yellow" },
    { label: "Pending Wholesalers", value: mockDashboard.pendingWholesalers.toString(), icon: AlertTriangle, color: "red" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Super Admin Portal</h1>
          </div>
          <p className="text-sm text-foreground-secondary mt-1">
            Platform management and system configuration
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground-secondary hover:text-foreground hover:border-border"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${STAT_ICON_BG[stat.color]} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${STAT_ICON_TEXT[stat.color]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground-secondary">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Organizations Summary */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Platform Growth</h3>
              <div className="space-y-4">
                {[
                  { label: "Vendor Growth (MoM)", value: "+12.5%" },
                  { label: "Wholesaler Growth (MoM)", value: "+8.3%" },
                  { label: "Revenue Growth (MoM)", value: "+23.1%" },
                  { label: "Customer Acquisition Cost", value: "$42.50" },
                  { label: "Customer Lifetime Value", value: "$1,245" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-foreground-secondary">{item.label}</span>
                    <span className={`text-sm font-medium ${item.value.startsWith("+") ? "text-green-600" : "text-foreground"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">System Status</h3>
              <div className="space-y-3">
                {mockHealth.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${service.status === "healthy" ? "bg-green-500" : service.status === "degraded" ? "bg-yellow-500" : "bg-red-500"}`} />
                      <span className="text-sm text-foreground">{service.service_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground-secondary">{service.response_time_ms}ms</span>
                      <span className={`text-xs font-medium ${service.status === "healthy" ? "text-green-600" : service.status === "degraded" ? "text-yellow-600" : "text-red-600"}`}>{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Flags Tab */}
      {activeTab === "feature-flags" && (
        <div className="bg-white rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Feature Flags</h3>
            <p className="text-sm text-foreground-secondary mt-1">Toggle platform features on and off</p>
          </div>
          <div className="divide-y divide-border">
            {featureFlags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{flag.name}</p>
                  <p className="text-sm text-foreground-secondary">{flag.description}</p>
                </div>
                <button
                  onClick={() => toggleFlag(flag.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flag.is_enabled ? "bg-primary" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flag.is_enabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === "system-health" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {mockHealth.map((service) => (
            <div key={service.id} className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${service.status === "healthy" ? "bg-green-500" : service.status === "degraded" ? "bg-yellow-500" : "bg-red-500"}`} />
                  <h3 className="font-semibold text-foreground">{service.service_name}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === "healthy" ? "bg-green-100 text-green-800" : service.status === "degraded" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                  {service.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Response Time</span>
                  <span className="text-sm font-medium text-foreground">{service.response_time_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Last Check</span>
                  <span className="text-sm text-foreground">{new Date(service.last_check).toLocaleTimeString()}</span>
                </div>
                {service.details && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-800">{service.details}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit-logs" && (
        <div className="bg-white rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Audit Logs</h3>
            <p className="text-sm text-foreground-secondary mt-1">Track all system changes and user actions</p>
          </div>
          <div className="divide-y divide-border">
            {[
              { action: "Vendor Approved", user: "Admin", entity: "TechWorld Electronics", time: "2 hours ago" },
              { action: "Feature Flag Updated", user: "Super Admin", entity: "multi_warehouse", time: "5 hours ago" },
              { action: "Product Approved", user: "Admin", entity: "Wireless Earbuds Pro", time: "1 day ago" },
              { action: "Wholesaler Approved", user: "Admin", entity: "Global Trade Corp", time: "2 days ago" },
              { action: "Commission Rate Changed", user: "Super Admin", entity: "Fashion Hub (10% → 12%)", time: "3 days ago" },
              { action: "System Health Alert", user: "System", entity: "AI Service degraded", time: "3 days ago" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-foreground-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{log.action}</p>
                    <p className="text-xs text-foreground-secondary">by {log.user} • {log.entity}</p>
                  </div>
                </div>
                <span className="text-xs text-foreground-secondary">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
