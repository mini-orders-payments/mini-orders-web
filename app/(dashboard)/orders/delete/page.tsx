"use client";

import { useState, type FormEvent ,useEffect} from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Field } from "@/components/field";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/statusBadge";
import { type Order } from "@/types/orders";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth-actions";

export default function DeleteOrderPage() {
  
  const [orderNumber, setOrderNumber] = useState("");
  const [found, setFound] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<number | null>(null);
  const [orders,setOrders]=useState<Order[]>([]);



  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    setDeleted(null);
    const res = await fetch(`http://localhost:3000/orders/${orderNumber}`);

    const data=await res.json();


    if (data.statusCode === 404) {
      setError("No order found with that id.");
      setFound(null);
      return;
    }
    const match=data
    setError(null);
    setFound(match);
  }

  useEffect(()=>{
  
  async function fetchOrders() {
    setDeleted(null);

    const profile = await getCurrentUser()
    const id=profile.id

    const res = await fetch(`http://localhost:3000/orders/user/${id}`);

    const data=await res.json();

    setOrders(data)
  }fetchOrders();},
  []
);

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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="deleteSelect" className="text-sm font-medium text-ink">
            Select an order to delete
          </label>
          <select
            id="deleteSelect"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="h-10 rounded-md border border-line bg-transparent px-3 text-sm text-ink outline-none transition-colors focus:border-ink"
          >
            <option value="" disabled>
              -- Select an order --
            </option>
            {/* Maps over all of their fetched orders */}
            {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order {order.id} ({order.status}) — Kshs {Number(order.amount).toFixed(2)}
                </option>
              ))}
          </select>
        </div>
        
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
