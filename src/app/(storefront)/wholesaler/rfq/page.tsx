"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Send, Trash2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RFQItem {
  id: string;
  product: string;
  quantity: number;
  notes: string;
}

interface RFQ {
  id: string;
  items: RFQItem[];
  status: string;
  notes: string;
  date: string;
  response?: { price: number; eta: string };
}

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: "RFQ-0042",
      items: [{ id: "1", product: "Hydraulic Cylinder HC-200", quantity: 50, notes: "Need by next month" }],
      status: "pending",
      notes: "",
      date: new Date().toISOString(),
    },
    {
      id: "RFQ-0041",
      items: [
        { id: "2", product: "Industrial Bearing Set", quantity: 100, notes: "" },
        { id: "3", product: "Steel Rod 12mm", quantity: 200, notes: "Grade 304 preferred" },
      ],
      status: "quoting",
      notes: "Being reviewed by sales team",
      date: new Date(Date.now() - 86400000).toISOString(),
      response: { price: 12500, eta: "15-20 business days" },
    },
  ]);

  const [newProduct, setNewProduct] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newNotes, setNewNotes] = useState("");
  const [items, setItems] = useState<Omit<RFQItem, "id">[]>([]);

  const addItem = () => {
    if (!newProduct.trim() || newQty < 1) return;
    setItems(prev => [...prev, { product: newProduct.trim(), quantity: newQty, notes: newNotes }]);
    setNewProduct("");
    setNewQty(1);
    setNewNotes("");
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const submitRFQ = () => {
    if (items.length === 0) return;
    const newRFQ: RFQ = {
      id: `RFQ-${String(rfqs.length + 1).padStart(4, "0")}`,
      items: items.map((item, i) => ({ ...item, id: String(i) })),
      status: "pending",
      notes: "",
      date: new Date().toISOString(),
    };
    setRfqs(prev => [newRFQ, ...prev]);
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg">Request for Quote</h2>
        <p className="text-sm text-foreground-secondary">Submit bulk quote requests and track responses</p>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-foreground mb-4">New RFQ</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Product name / SKU"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              placeholder="Quantity"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
            />
          </div>
          <Textarea
            placeholder="Special requirements..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={2}
          />
          <Button onClick={addItem} variant="secondary" size="sm">
            <Plus className="w-4 h-4" /> Add Item
          </Button>

          {items.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.product}</p>
                    <p className="text-xs text-foreground-secondary">Qty: {item.quantity}{item.notes ? ` - ${item.notes}` : ""}</p>
                  </div>
                  <button onClick={() => removeItem(i)} className="p-1 hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <Button onClick={submitRFQ} className="shimmer-btn">
              <Send className="w-4 h-4" /> Submit RFQ ({items.length} items)
            </Button>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-foreground mb-4">RFQ History</h3>
        {rfqs.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No RFQs yet. Create your first one above.</p>
        ) : (
          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-foreground-secondary" />
                    <span className="text-sm font-semibold text-foreground">{rfq.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                      rfq.status === "completed" ? "bg-success/10 text-success" :
                      rfq.status === "quoting" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {rfq.status}
                    </span>
                  </div>
                  <span className="text-xs text-foreground-secondary">{formatDate(rfq.date)}</span>
                </div>
                <div className="space-y-1">
                  {rfq.items.map((item) => (
                    <p key={item.id} className="text-sm text-foreground-secondary">
                      {item.product} &times; {item.quantity}
                    </p>
                  ))}
                </div>
                {rfq.response && (
                  <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-foreground">Quote: {formatCurrency(rfq.response.price)}</span>
                      <span className="text-foreground-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {rfq.response.eta}
                      </span>
                    </div>
                  </div>
                )}
                {rfq.notes && (
                  <p className="text-xs text-foreground-secondary mt-2">{rfq.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}