import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-full h-screen bg-pink-300 '>Hello "/about"!</div>
}
