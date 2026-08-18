'use client';

import { useState,useEffect } from "react";
import Link from "next/link";
import { Pencil, PackageOpen } from "lucide-react";
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
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-line last:border-0 hover:bg-paper/60">
              <td className="ledger-mono px-4 py-3 text-ink">{order.id}</td>
              <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
              <td className="ledger-mono px-4 py-3 text-ink">{Number(order.amount).toFixed(2)}</td>
              <td className="px-4 py-3 text-ink-soft">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditing(order)}
                        aria-label={`Edit order ${order.id}`}
                        className="rounded-md p-2 text-ink-faint hover:bg-accent-soft hover:text-accent-ink"
                      >
                        <Pencil size={16} />
                      </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <ul className="mt-8 flex flex-col gap-3 sm:hidden">
         {orders.map((order) => (
           <li key={order.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-start justify-between">
                 <div>
                    <p className="ledger-mono text-sm font-semibold text-ink">{order.id}</p>
                    
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditing(order)}
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
                    </li>
                  ))}
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
