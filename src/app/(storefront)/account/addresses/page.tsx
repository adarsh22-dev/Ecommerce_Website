"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";

const placeholderAddresses = [
  {
    id: "1",
    full_name: "John Doe",
    address_line1: "123 Main Street",
    address_line2: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "US",
    phone: "+1 234 567 890",
    is_default: true,
  },
  {
    id: "2",
    full_name: "John Doe",
    address_line1: "456 Work Ave",
    address_line2: null,
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "US",
    phone: "+1 234 567 890",
    is_default: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(placeholderAddresses);
  const [showModal, setShowModal] = useState(false);

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Addresses</h2>
        <Button onClick={() => setShowModal(true)} size="sm">
          <Plus className="w-4 h-4" /> Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="card p-6 relative">
            {address.is_default && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                  <Check className="w-3 h-3" /> Default
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{address.full_name}</p>
                <p className="text-sm text-foreground-secondary">{address.phone}</p>
              </div>
            </div>
            <p className="text-sm text-foreground-secondary mb-1">{address.address_line1}</p>
            {address.address_line2 && <p className="text-sm text-foreground-secondary mb-1">{address.address_line2}</p>}
            <p className="text-sm text-foreground-secondary">
              {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-sm text-foreground-secondary">{address.country}</p>
            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <button className="text-xs text-primary hover:text-primary/80 transition-colors">Edit</button>
              {!address.is_default && (
                <button className="text-xs text-foreground-secondary hover:text-foreground transition-colors">Set as Default</button>
              )}
              <button onClick={() => deleteAddress(address.id)} className="text-xs text-destructive hover:text-destructive/80 transition-colors ml-auto">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Address" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Input label="Full Name" placeholder="John Doe" /></div>
          <Input label="Phone" placeholder="+1 234 567 890" />
          <div className="sm:col-span-2"><Input label="Address Line 1" placeholder="123 Main St" /></div>
          <div className="sm:col-span-2"><Input label="Address Line 2 (optional)" placeholder="Apt, Suite, etc." /></div>
          <Input label="City" placeholder="New York" />
          <Input label="State" placeholder="NY" />
          <Input label="ZIP Code" placeholder="10001" />
          <Input label="Country" placeholder="US" />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={() => setShowModal(false)} className="shimmer-btn">Save Address</Button>
        </div>
      </Modal>
    </div>
  );
}
