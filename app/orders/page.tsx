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
    // TODO: intern — no loading/error handling here yet
    void fetch('http://localhost:3000/orders')
      .then((res) => res.json())
      .then((data: Order[]) => setOrders(data));
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
