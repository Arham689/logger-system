import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import '../../index.css'
import { User } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Route = createFileRoute('/auth/_layout')({
  beforeLoad: async ({ location }) => {
    try {
      const request = await axios.get(`${BASE_URL}/isauth`, { withCredentials: true });
      console.log('Auth Layout: isAuth check response:', request.data);


      if (request.data.isauth !== true) {
        console.log('Auth Layout: User NOT authenticated, redirecting to /');
        throw redirect({
          to: '/',
          search: {
            redirect: location.href,
          },
        });
      }
    } catch (error) {
      console.error('Auth Layout: Authentication check failed:', error);

      throw redirect({ to: '/' });
    }
  },
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  const navigate = useNavigate()
  const handleLogout =async ()=>{
    // clear the cookie and redirect to the home page 
    await axios.get(`${BASE_URL}/logout`)
    navigate({ to: '/' })
  }
  return (
    <div className=" w-full divide-y divide-[#808080b0] bg-black text-white" >
      <nav className="h-15 w-full flex justify-end items-center gap-5 px-2">
        <div>
          <button onClick={handleLogout} className='bg-red-500 rounded-lg px-4 py-2 cursor-pointer hover:bg-red-700'>Log Out</button>
        </div>
        <div className='border-2 border-[gray] rounded-full p-2'>
          <User />
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
