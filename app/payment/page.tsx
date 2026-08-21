"use client";

import { useState, type FormEvent,useEffect } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { Field } from "@/components/field";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/statusBadge";
import {  type Order } from "@/types/orders"
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth-actions";

export default function PaymentPage() {
 
  const [orders,setOrders ] =useState<Order[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [profile,setprofile]=useState<any>(null);
  const [found, setFound] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [phoneNumber,setPhoneNumber] =useState("");
  const [processing,setProcessing] = useState(false);
  

  async function handleLookup(e: FormEvent) {
    e.preventDefault();

    
   const match=orders.find((o)=>o.id === Number(orderNumber));

   if (!match) {
      setError("No order found with that ID ");
      setFound(null);
      return;
    }

    const cleanNumber=phoneNumber.trim()

    if(cleanNumber.length !== 12){

      setError("Invalid Number. Must be in the format 2547XXXXXXXX.")
      return;
    }

    
    setError(null);
    setFound(match!);
  }

  async function handlePay() {
    if (!found) return;

    setProcessing(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/pay/${found.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({phoneNumber:phoneNumber})

    });
     if (!res.ok){

      const errorData = await res.json().catch(() => ({})); 
        throw new Error(errorData.message || "Failed to connect to the payment gateway.");
     } 
     
     const data = await res.json();
     

     toast.info("STK Push sent! Please check your phone to enter your M-Pesa PIN.");

    let pollCount = 0;
    const maxPolls = 40; 

    const pollInterval = setInterval(async () => {
      pollCount++;

      if (pollCount >= maxPolls) {
            clearInterval(pollInterval);
            setProcessing(false);
            toast.warning("Payment timed out. Please refresh to check status later.");
            return;
          }

      try {
        const orderCheck = await fetch(`http://localhost:3000/orders/${found.id}`);
        const freshOrder = await orderCheck.json();

      if (freshOrder.status === "completed") {
        clearInterval(pollInterval);
        setProcessing(false);
        setPaid(true); // Update state
        toast.success("Payment Successful! Your order has been completed."); 
      } 
      else if (freshOrder.status === "failed") {
        clearInterval(pollInterval);
        setProcessing(false);
        toast.error("Payment Failed. The transaction was cancelled "); 
      }
    
    } catch (err) {
      console.error("Polling error:", err);
    }
     }, 1500);
     
    }
    catch (error:any) {
    console.error("Payment Error:", error);
     setProcessing(false);
    toast.error(error.message || "An unexpected error occurred.");
    }
    
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        
        const currentProfile = await getCurrentUser();
        if (!currentProfile) return;
        
        setprofile(currentProfile);

        //Format and set the phone number
        const phone = currentProfile.phone;
        const formattedPhone = phone.trim().replace("+", "");
        if (formattedPhone.startsWith("0")) {
          setPhoneNumber(`254${formattedPhone.substring(1)}`);
        } else {
          setPhoneNumber(formattedPhone);
        }
        
        
        const res = await fetch(`http://localhost:3000/orders/user/${currentProfile.id}`);
        const data = await res.json();
  
        if (Array.isArray(data)) {
           setOrders(data);
        } else {
          console.error('API did not return an array. Received:', data);
          setOrders([]);
        }

      } catch (error) {
        console.error("Data load error:", error);
        setOrders([]);
      }
    }

    fetchUserData();
  }, []);

  // Keep the displayed order in sync if it changes elsewhere (e.g. edited in View orders).
  const liveOrder = found ? orders.find((o) => o.id === found.id && o.status !== "completed") ?? null : null;

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

        <Field
        label="Enter phone number to pay from"
        placeholder="254712345678"
        value={phoneNumber}
        onChange={(e) => { const digitsOnly = e.target.value.replace(/\D/g, ""); // Removes non-digits
          setPhoneNumber(digitsOnly);}}
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
            <Button className="mt-4 w-full" onClick={handlePay} disabled={processing}>
              {processing ? "Processing ..." : `Pay Kshs ${Number(liveOrder.amount).toFixed(2)}`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
