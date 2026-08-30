export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}