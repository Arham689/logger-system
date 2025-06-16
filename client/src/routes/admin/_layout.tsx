import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async ({ location }) => {
    try {
      const request = await axios.get(`${BASE_URL}/isadmin`, { withCredentials: true });
      console.log(request.data);

      if (!request.data.isAdmin) {
        throw redirect({
          to: '/',
          search: {
            redirect: location.href,
          },
        });
      }
      console.log('Auth Layout: User authenticated, continuing to child route.');
    } catch (error) {
      console.error('Auth Layout: Authentication check failed:', error);

      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />{' '}
    </div>
  );
}
