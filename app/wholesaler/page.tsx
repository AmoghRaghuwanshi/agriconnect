import { redirect } from 'next/navigation';

/**
 * /wholesaler → redirect to /wholesaler/dashboard
 */
export default function WholesalerIndexPage() {
  redirect('/wholesaler/dashboard');
}
