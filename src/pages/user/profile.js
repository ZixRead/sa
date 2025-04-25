import UserLayout from '@/components/UserLayout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function UserProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user.id) {
        try {
          const res = await fetch(`/api/users/${session.user.id}`)
          const data = await res.json()
          setUserData(data.user)
          setLoading(false)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [session])

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="relative">
                <img
                  className="h-32 w-32 rounded-full object-cover"
                  src={userData.image || '/images/default-avatar.png'}
                  alt="Profile"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{userData.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.department || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.position || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Attendance Rate</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.attendanceRate}%</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}