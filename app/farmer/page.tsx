import { redirect } from 'next/navigation';

/**
 * /farmer → redirect to /farmer/dashboard
 */
export default function FarmerIndexPage() {
  redirect('/farmer/dashboard');
}
