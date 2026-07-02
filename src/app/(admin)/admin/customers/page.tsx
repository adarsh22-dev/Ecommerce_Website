"use client";

import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";

const placeholderCustomers = [
  { id: "1", full_name: "Sarah Mitchell", email: "sarah@email.com", orders: 12, total_spent: 2840, created_at: "2023-06-15", status: "active" },
  { id: "2", full_name: "John Davis", email: "john@email.com", orders: 8, total_spent: 1920, created_at: "2023-08-22", status: "active" },
  { id: "3", full_name: "Emily Roberts", email: "emily@email.com", orders: 5, total_spent: 780, created_at: "2023-11-10", status: "active" },
  { id: "4", full_name: "Mike Thompson", email: "mike@email.com", orders: 3, total_spent: 450, created_at: "2024-01-05", status: "active" },
  { id: "5", full_name: "Lisa Kim", email: "lisa@email.com", orders: 1, total_spent: 125, created_at: "2024-01-20", status: "new" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = placeholderCustomers.filter(
    (c) => c.full_name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-sm text-foreground-secondary mt-1">{placeholderCustomers.length} total customers</p>
      </div>

      <div className="bg-white rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 max-w-sm">
            <Search className="w-4 h-4 text-foreground-secondary" />
            <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Customer</th>
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Orders</th>
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Total Spent</th>
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Joined</th>
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Status</th>
                <th className="text-right text-xs font-medium text-foreground-secondary p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {customer.full_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.full_name}</p>
                        <p className="text-xs text-foreground-secondary">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{customer.orders}</td>
                  <td className="p-4 text-sm font-medium">{formatCurrency(customer.total_spent)}</td>
                  <td className="p-4 text-sm text-foreground-secondary">{formatDate(customer.created_at)}</td>
                  <td className="p-4"><Badge variant={customer.status === "new" ? "primary" : "success"}>{customer.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors"><Mail className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
