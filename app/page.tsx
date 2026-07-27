import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>mini-order-payments-web</h1>
      <p>
        <Link href="/orders">View orders</Link>
      </p>
    </main>
  );
}
