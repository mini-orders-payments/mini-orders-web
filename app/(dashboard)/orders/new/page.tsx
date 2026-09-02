"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Field } from "@/components/field";
import { Button } from "@/components/button";
import { type Order } from "@/types/orders";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/server-actions";


const Backend=process.env.NEXT_PUBLIC_API_URL

export default function CreateOrderPage() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Order | null>(null);


  
async function getUser(){
  
}


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const profile =await getCurrentUser()

    const id=profile?.id

    if (!id || isNaN(Number(id))){
      setError("A valid User ID is required.");
    return;
    }

    if (!id || !amount.trim()) {
      setError("User id, and amount are all required.");
      return;
    }
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a number greater than zero.");
      return;
    }

    try{
        const res = await fetch(`${Backend}/orders/`,{
                method:'POST',
                headers:{"content-Type":"application/json"},
                body:JSON.stringify({userId:Number(id),amount})});
               
            if (!res.ok) throw new Error('Failed to create order');
        
            const data = await res.json();
            setCreated(data)
            toast.success(`Order created successfully!`);
            }

            catch (error) {
               console.error('Error:', error);
               toast.error("Failed to create order.");
             }
        }

       
      

  return (
    <div>

      <h1 className="ledger-heading text-2xl font-bold text-ink">Create order</h1>
      
      
      <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-5" noValidate>
        
        
        <Field
          label="Amount"
          placeholder="70.00"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && (
          <p role="alert" className="rounded-md bg-rust-soft px-3 py-2 text-sm text-rust-ink">
            {error}
          </p>
        )}

        <div className="mt-1 flex items-center gap-3">
          <Button type="submit">Create</Button>
          <Link href="/orders" className="text-sm font-medium text-ink-soft hover:text-ink">
            View all orders
          </Link>
        </div>
      </form>

      {created && (
        <div className="mt-8 flex max-w-sm items-start gap-3 rounded-lg border border-line bg-surface p-4">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" />
          <div className="ledger-mono text-sm text-ink-soft">
            <p className="font-semibold text-ink">Order created</p>
            <p className="mt-1">id: {created.id}</p>
            <p>amount: {Number(created.amount).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );

}

