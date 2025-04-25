import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-xl font-bold text-indigo-600">Attendance System</a>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    {session.user.name} ({session.user.role})
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <a className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white">
                  Sign in
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}