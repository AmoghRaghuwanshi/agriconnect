import { redirect } from 'next/navigation';

/**
 * /admin → redirect to /admin/dashboard
 * Prevents 404 when users navigate to /admin directly.
 */
export default function AdminIndexPage() {
  redirect('/admin/dashboard');
}
