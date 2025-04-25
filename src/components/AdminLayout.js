// src/components/AdminLayout.js
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect if not admin
  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  if (status === 'authenticated' && session.user.role !== 'admin') {
    router.push('/')
    return null
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Attendance System Admin Panel" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Sidebar (Mobile) */}
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex flex-col w-64 bg-white">
            <div className="flex items-center justify-between h-16 px-4 bg-indigo-600">
              <span className="text-white font-semibold">Admin Panel</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <SidebarLinks currentPath={router.pathname} />
            </nav>
          </div>
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-indigo-700 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-xl font-bold">Attendance System</h1>
            </div>
            <nav className="mt-5 flex-1 flex flex-col divide-y divide-indigo-800 overflow-y-auto">
              <div className="px-2 space-y-1">
                <SidebarLinks currentPath={router.pathname} />
              </div>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Top navigation */}
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex"></div>
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session?.user?.image || '/images/default-avatar.png'}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                      <p className="text-xs font-medium text-gray-500">Admin</p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/login' })}
                      className="ml-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="flex-1 pb-8">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

const SidebarLinks = ({ currentPath }) => {
  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Events', href: '/admin/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ]

  return (
    <>
      {links.map((item) => (
        <Link key={item.name} href={item.href}>
          <a
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              currentPath === item.href
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:text-white hover:bg-indigo-600'
            }`}
          >
            <svg
              className={`mr-3 h-6 w-6 ${
                currentPath === item.href ? 'text-white' : 'text-indigo-300 group-hover:text-white'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            {item.name}
          </a>
        </Link>
      ))}
    </>
  )
}

export default AdminLayout