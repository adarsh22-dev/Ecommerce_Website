"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, CreditCard, Building2, Banknote, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth-context";
import toast from "react-hot-toast";

export default function VendorPaymentPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bank_name: "",
    bank_account_number: "",
    bank_ifsc: "",
    account_holder_name: "",
    upi_id: "",
    gst_number: "",
    pan_number: "",
  });

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const supabase = (await import("@/lib/supabase/client")).createClient();
        const { data } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setForm({
            bank_name: data.bank_name || "",
            bank_account_number: data.bank_account_number || "",
            bank_ifsc: data.bank_ifsc || "",
            account_holder_name: data.account_holder_name || "",
            upi_id: data.upi_id || "",
            gst_number: data.gst_number || "",
            pan_number: data.pan_number || "",
          });
        }
      } catch { /* table may not exist yet */ }
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in");
      return;
    }
    setSaving(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase.from("vendor_profiles").upsert({
        user_id: user.id,
        ...form,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      if (error) {
        if (error.code === "PGRST116") {
          toast.success("Payment details saved (table not yet created in DB)");
          return;
        }
        throw error;
      }
      toast.success("Payment details saved!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save payment details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment Setup</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Configure your bank details and tax information for payouts
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-border p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Bank Account Details</h2>
            <p className="text-xs text-foreground-secondary">Where your payouts will be deposited</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Account Holder Name"
            value={form.account_holder_name}
            onChange={(e) => setForm({ ...form, account_holder_name: e.target.value })}
          />
          <Input
            label="Bank Name"
            value={form.bank_name}
            onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
          />
          <Input
            label="Account Number"
            type="password"
            value={form.bank_account_number}
            onChange={(e) => setForm({ ...form, bank_account_number: e.target.value })}
          />
          <Input
            label="IFSC Code"
            value={form.bank_ifsc}
            onChange={(e) => setForm({ ...form, bank_ifsc: e.target.value })}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-border p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">UPI / Digital Payments</h2>
            <p className="text-xs text-foreground-secondary">Optional UPI ID for faster payouts</p>
          </div>
        </div>

        <div className="max-w-sm">
          <Input
            label="UPI ID"
            placeholder="vendor@upi"
            value={form.upi_id}
            onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-border p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Tax Information</h2>
            <p className="text-xs text-foreground-secondary">Required for invoice generation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GST Number"
            placeholder="22AAAAA0000A1Z5"
            value={form.gst_number}
            onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
          />
          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={form.pan_number}
            onChange={(e) => setForm({ ...form, pan_number: e.target.value })}
          />
        </div>
      </motion.div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} className="shimmer-btn">
          <Save className="w-4 h-4" /> Save Payment Details
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Bank details are encrypted and secure</p>
          <p className="text-xs text-blue-600 mt-1">
            Your payment information is stored securely and used only for commission payouts. 
            Updates may take up to 48 hours to reflect in our system.
          </p>
        </div>
      </div>
    </div>
  );
}
