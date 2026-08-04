"use client";

import { useState, type FormEvent,useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field } from "@/components/field";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/statusBadge";
import {  type Order } from "@/types/orders"

export default function PaymentPage() {
 
  const [orders,setOrders ] =useState<Order[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [found, setFound] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
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

  async function handlePay() {
    if (!found) return;

    try {
    const res = await fetch(`http://localhost:3000/orders/${found.id}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

    });

    if (!res.ok) throw new Error("Failed to delete order from backend server");

    const data = await res.json();
    console.log(data.msg);

    setPaid(true);
    setFound(null);
    }
    catch (error) {
    console.error("Deletion pipeline failed:", error);
    }
    
  }

  useEffect(() => {
      async function fetchorders() {
        try{
          const res = await fetch('http://localhost:3000/orders');
          const data= await res.json();
  
          if(Array.isArray(data)){
             setOrders(data)
          }
          else{
            console.error('API did not return an array. Received:', data);
            setOrders([]);
          }
        }
        catch(error){
          console.error(`Fetch error : ${error}`);
          setOrders([]);
        }  
      }
      fetchorders();
    }, []);

  // Keep the displayed order in sync if it changes elsewhere (e.g. edited in View orders).
  const liveOrder = found ? orders.find((o) => o.id === found.id) ?? null : null;

  return (
    <div>
      <h1 className="ledger-heading text-2xl font-bold text-ink">Payment</h1>

      <form onSubmit={handleLookup} className="mt-8 flex max-w-sm flex-col gap-5">
        <Field
          label="Order id to pay for"
          placeholder="ord_1002"
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

      {liveOrder && (
        <div className="mt-8 max-w-sm">
          <h2 className="text-sm font-semibold text-ink">Order info</h2>
          <div className="mt-2 rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="ledger-mono text-sm text-ink">{liveOrder.id}</span>
              <StatusBadge status={paid ? "completed" : liveOrder.status} />
            </div>
            <dl className="mt-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">User</dt>
                <dd className="ledger-mono text-ink">{liveOrder.userId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Order number</dt>
                <dd className="ledger-mono text-ink">{liveOrder.orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Amount due</dt>
                <dd className="ledger-mono font-semibold text-ink">Kshs {Number(liveOrder.amount).toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {paid ? (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent-ink">
              <CheckCircle2 size={16} />
              Payment recorded
            </div>
          ) : (
            <Button className="mt-4 w-full" onClick={handlePay}>
              Pay Kshs {Number(liveOrder.amount).toFixed(2)}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
