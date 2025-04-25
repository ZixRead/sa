import AdminLayout from '@/components/AdminLayout'
import UserTable from '@/components/UserTable'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
        const data = await res.json()
        setUsers(data.users)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setLoading(false)
      }
    }

    if (session?.user.role === 'admin') {
      fetchUsers()
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
        <h1 className="text-3xl font-bold mb-8">Users Management</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <UserTable users={users} />
        </div>
      </div>
    </AdminLayout>
  )
}