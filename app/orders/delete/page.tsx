"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Field } from "@/components/field";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/statusBadge";
import { type Order } from "@/types/orders";
import { toast } from "sonner";

export default function DeleteOrderPage() {
  
  const [orderNumber, setOrderNumber] = useState("");
  const [found, setFound] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string | null>(null);

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    setDeleted(null);
    const res = await fetch(`http://localhost:3000/orders/${orderNumber}`);

    const data=await res.json();


    if (data.statusCode==404) {
      setError("No order found with that id.");
      setFound(null);
      return;
    }
    const match=data
    setError(null);
    setFound(match);
  }

  async function handleDelete() {

    if (!found) return;

    try {
    const res = await fetch(`http://localhost:3000/orders/${found.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to delete order from backend server");

    const data = await res.json();
    console.log(data.msg);

    setDeleted(found.id);
    setFound(null);
    toast.success(`Order ${found.id} deleted permanently.`);
    }
    catch (error) {
    console.error("Deletion pipeline failed:", error);
    toast.error(`Failed to delete order ${orderNumber}`)
    }
    
  }

  return (
    <div>
      <h1 className="ledger-heading text-2xl font-bold text-ink">Delete order</h1>

      <form onSubmit={handleLookup} className="mt-8 flex max-w-sm flex-col gap-5">
        <Field
          label="Order id to delete"
          placeholder="1003"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          autoComplete="off"
        />
        {error && (
          <p role="alert" className="rounded-md bg-rust-soft px-3 py-2 text-sm text-rust-ink">
            {error}
          </p>
        )}
        <Button type="submit" variant="outline" className="self-start">
          Look up order
        </Button>
      </form>

      {found && (
        <div className="mt-8 max-w-sm rounded-lg border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="ledger-mono text-sm text-ink">{found.id}</span>
            <StatusBadge status={found.status} />
          </div>
          <p className="ledger-mono mt-2 text-sm text-ink-soft">
            {found.orderNumber} · ${Number(found.amount).toFixed(2)}
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-md bg-rust-soft px-3 py-2.5 text-sm text-rust-ink">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>Deleting an order can't be undone.</p>
          </div>

          <Button variant="danger" className="mt-4 w-full" onClick={handleDelete}>
            Delete order
          </Button>
        </div>
      )}

      {deleted && (
        <div className="mt-8 flex max-w-sm items-center gap-2 rounded-md bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent-ink">
          <CheckCircle2 size={16} />
          <span className="ledger-mono">{deleted}</span> was deleted.
        </div>
      )}
    </div>
  );
}
