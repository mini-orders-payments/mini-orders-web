"use client";

import { useState, type FormEvent } from "react";
import { X, Trash2 } from "lucide-react";
import { Field } from "./field";
import { Button } from "./button";
import type { Order } from  "../types/orders"
import { toast } from "sonner";

type Props = {
  order: Order;
  onClose: () => void;
  onSave: (amount: number) => void;
  onDelete: ()=> void;
  
};

export function EditOrderModal({ order, onClose, }: Props) {
  const [amount, setAmount] = useState(String(order.amount));
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
 
  async function handleDelete() {

    if (!order.id) return;

    try {
    const res = await fetch(`http://localhost:3000/orders/${order.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to delete order from backend server");

    const data = await res.json();
    console.log(data.msg);
    toast.success(`Order ${order.id} deleted permanently.`);
    }
    catch (error) {
    console.error("Deletion pipeline failed:", error);
    toast.error(`Failed to delete order ${order.id}`)
    }
    
  }


  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    try{
        const res=await fetch(`http://localhost:3000/orders/${order.id}/edit`,{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({amount: parsed})
        });
    toast.success(`Order ${order.id} updated successfully`)
    }
    catch(error){
        console.log(error)
        toast.error("Failed to update order amount")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 px-0 backdrop-blur-[1px] sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-order-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-lg border border-line bg-surface p-6 shadow-xl sm:rounded-lg"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="edit-order-title" className="text-lg font-bold text-ink">
              Edit order
            </h2>
            <p className="ledger-mono mt-0.5 text-xs text-ink-faint">{order.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-faint hover:bg-paper hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {!confirmingDelete ? (
          <>
            <form onSubmit={handleSave} className="mt-5 flex flex-col gap-4">
              <Field
                label="Amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
              {error && (
                <p role="alert" className="rounded-md bg-rust-soft px-3 py-2 text-sm text-rust-ink">
                  {error}
                </p>
              )}
              <Button type="submit">Save amount</Button>
            </form>

            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-2 text-sm font-semibold text-rust hover:text-rust-ink"
              >
                <Trash2 size={15} />
                Delete this order
              </button>
            </div>
          </>
        ) : (
          <div className="mt-5">
            <p className="text-sm leading-relaxed text-ink-soft">
              Delete order <span className="ledger-mono font-semibold text-ink">{order.id}</span>?
              This can't be undone.
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="danger" onClick={handleDelete}>
                Delete order
              </Button>
              <Button variant="outline" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
