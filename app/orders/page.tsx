'use client';

import { useEffect, useState } from 'react';

type Order = {
  id: string;
  status: string;
  amount: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

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
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>status</th>
            <th>amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
