import { requireRole } from '@/lib/rbac';

export default async function DashboardPage() {
  const allowed = await requireRole(['ADMIN']);
  if (!allowed) {
    return (
      <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
        <h1>Access denied</h1>
      </main>
    );
  }
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Admin Dashboard</h1>
    </main>
  );
}


