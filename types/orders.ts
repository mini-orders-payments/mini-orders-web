

export type OrderStatus = "pending" | "completed" | "failed";

export type Order = {
  id: string;
  orderNumber: string;
  userId:number;
  amount: number;
  status: OrderStatus;
  createdAt: string; // ISO date
};