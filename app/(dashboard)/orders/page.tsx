'use client';

import { useState,useEffect ,Fragment} from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-actions";
import { Pencil, PackageOpen,ChevronDown,ChevronUp } from "lucide-react";
import { type Order } from "@/types/orders"
import { StatusBadge } from "@/components/statusBadge";
import { EditOrderModal } from "@/components/editOrder";
import { Button } from "@/components/button";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing,setEditing] = useState<Order | null>(null);
  const [expandedId,setExpandedId] = useState < Number | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<Record<number, any>>({});

  function handleSave(amount: number) {
    if (!editing) return;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === editing.id ? { ...order, amount: amount } : order
      )
    );
    setEditing(null);
  }

  function handleDelete() {
    if (!editing) return;

    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== editing.id)
    );
    
    setEditing(null);
  }

  async function toggleRow(orderId: number) {
    if (expandedId === orderId) {
      setExpandedId(null); 
      return;
    }
    
    setExpandedId(orderId); 

    if (!paymentDetails[orderId]) {
      try {
        const res = await fetch(`http://localhost:3000/pay/order/${orderId}`);
        const data = await res.json();

        console.log(`Payment data for Order ${orderId}:`, data);
        
        setPaymentDetails((prev) => ({ ...prev, [orderId]: data }));
      } catch (error) {
        console.error("Failed to fetch payment details", error);
      }
    }}

  useEffect(() => {
    async function fetchorders() {

      const profile = await getCurrentUser();
      const id=profile.id
      try{
        const res = await fetch(`http://localhost:3000/orders/user/${id}`);
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

  return (
    <main>
     <div className="flex items-baseline justify-between">
        <h1 className="ledger-heading text-2xl font-bold text-ink">View orders</h1>
        <Link href="/orders/new" className="hidden text-sm font-semibold text-accent-ink sm:block">
          + New order
        </Link>
      </div>


      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong py-16 text-center">
          <PackageOpen size={28} className="text-ink-faint" />
          <p className="text-sm font-medium text-ink">No orders yet</p>
          <p className="max-w-xs text-sm text-ink-soft">
            Orders you create will show up here as ledger rows.
          </p>
          <Link href="/orders/new">
            <Button className="mt-2">Create an order</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
      <div className="mt-8 hidden overflow-hidden rounded-lg border border-line bg-surface sm:block">
      <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-3">Id</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Created at</th>
                  <th className="px-4 py-3 text-right">Edit</th>
                </tr>
              </thead>
        <tbody>
          {orders.map((order) => {

            const payment = paymentDetails[order.id];

            return(
            <Fragment key={order.id}>
              

            <tr onClick={()=> toggleRow(order.id)}
              className=" cursor-pointer border-b border-line last:border-0 hover:bg-paper/60 transition-colors">

              <td className="ledger-mono px-4 py-3 text-ink flex items-center gap-2">
                {expandedId===order.id ? <ChevronUp size={16} className="text-ink-faint"/> : <ChevronDown size={16} className="text-ink-faint"/>}
                {order.id}
                </td>

              <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
              <td className="ledger-mono px-4 py-3 text-ink">{Number(order.amount).toFixed(2)}</td>
              <td className="px-4 py-3 text-ink-soft">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) =>{
                           e.stopPropagation();
                           setEditing(order)}}
                        aria-label={`Edit order ${order.id}`}
                        className="rounded-md p-2 text-ink-faint hover:bg-accent-soft hover:text-accent-ink"
                      >
                        <Pencil size={16} />
                      </button>
                </td>
            </tr>
            {expandedId===order.id &&(
             <tr className="border-b border-line bg-paper/30">
                        <td colSpan={5} className="px-4 py-4 px-10">
                          <div className="grid grid-cols-2 gap-4 text-sm text-ink-soft">
                            <div>
                              <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-1">M-Pesa Receipt</p>
                             
                              <p className="ledger-mono">{payment?.paymentCode || "Awaiting payment"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-1">Transaction Result</p>
                              <p>{payment?.resultDesc || "Pending Safaricom confirmation"}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
            );
  })}
        </tbody>
      </table>
      </div>
      <ul className="mt-8 flex flex-col gap-3 sm:hidden">
         {orders.map((order) => {
            const payment =paymentDetails[order.id];
            return(
         
           <li key={order.id} className="rounded-lg border border-line bg-surface p-4">
              <div 
                  className="cursor-pointer"
                  onClick={() => toggleRow(order.id)}
                >
              <div className="flex items-start justify-between">
                 <div>
                    <p className="ledger-mono text-sm font-semibold text-ink">{order.id}</p>
                    {expandedId === order.id ? <ChevronUp size={16} className="text-ink-faint" /> : <ChevronDown size={16} className="text-ink-faint" />}
                    
                  </div>

                  <button
                    type="button"
                    onClick={(e) =>{e.stopPropagation(); setEditing(order)} }
                    aria-label={`Edit order ${order.id}`}
                    className="rounded-md p-2 text-ink-faint hover:bg-accent-soft hover:text-accent-ink" >

                    <Pencil size={16} />
                  </button>
                   </div>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusBadge status={order.status} />
                      <span className="ledger-mono text-base font-semibold text-ink">
                       Ksh {Number(order.amount).toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-ink-faint">{formatDate(order.createdAt)}</p>
                      </div>
                      {expandedId === order.id && (
                  <div className="mt-4 border-t border-line pt-4 flex flex-col gap-3 text-sm text-ink-soft">
                    <div>
                      <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-1">M-Pesa Receipt</p>
                      <p className="ledger-mono">{payment?.paymentCode || "Awaiting payment"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-1">Transaction Result</p>
                      <p>{payment?.resultDesc || "Pending Safaricom confirmation"}</p>
                    </div>
                  </div>
                )}
                    </li>
            )})}
                </ul>
              </>
          )}

          {editing && (
        <EditOrderModal
          order={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </main>
    

  );
  }
