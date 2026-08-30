import { Nav } from "@/components/nav"; // Adjust this import path as needed
import { getCurrentUser } from "@/lib/auth-actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Nav user={user} />
      <main className="flex-1 px-4 py-8 sm:px-8 md:px-12 md:py-12">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}