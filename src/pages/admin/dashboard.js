import AdminLayout from '@/components/AdminLayout'
import StatsCard from '@/components/StatsCard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    avgAttendance: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        const data = await res.json()
        setStats({
          totalUsers: data.totalUsers,
          totalEvents: data.totalEvents,
          avgAttendance: data.avgAttendance
        })
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setLoading(false)
      }
    }

    if (session?.user.role === 'admin') {
      fetchStats()
    }
  }, [session])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon="👥" 
            trend="up" 
            trendText="5% from last month" 
            color="blue" 
          />
          <StatsCard 
            title="Total Events" 
            value={stats.totalEvents} 
            icon="📅" 
            trend="up" 
            trendText="3 new events" 
            color="green" 
          />
          <StatsCard 
            title="Avg Attendance" 
            value={`${stats.avgAttendance}%`} 
            icon="✅" 
            trend={stats.avgAttendance >= 80 ? 'up' : 'down'} 
            trendText={stats.avgAttendance >= 80 ? 'Good' : 'Needs improvement'} 
            color="indigo" 
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <p className="text-gray-500">No recent activities</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}