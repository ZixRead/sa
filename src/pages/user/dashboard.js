import UserLayout from '@/components/UserLayout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function UserDashboard() {
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
        <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${
                  userData.attendanceRate >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                }`} 
                style={{ width: `${userData.attendanceRate}%` }}
              ></div>
            </div>
            <span className="ml-4 text-lg font-medium">
              {userData.attendanceRate}%
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {userData.attendanceRate >= 80 ? 
              'You meet the minimum attendance requirement' : 
              'You need to attend more events to meet the requirement'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
          {userData.attendance.length > 0 ? (
            <div className="space-y-4">
              {userData.attendance.slice(0, 5).map((record, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{record.event?.name || 'Unknown Event'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.markedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'present' ? 'Present' :
                       record.status === 'paid' ? 'Paid' : 'Absent'}
                    </span>
                  </div>
                  {record.reason && (
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {record.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No attendance records found</p>
          )}
        </div>
      </div>
    </UserLayout>
  )
}