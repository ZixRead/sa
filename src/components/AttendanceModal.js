import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AttendanceModal({ isOpen, onClose, user }) {
  const { data: session } = useSession()
  const [status, setStatus] = useState('present')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          status,
          reason: status === 'absent' ? reason : ''
        }),
      })

      if (res.ok) {
        onClose()
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Mark Attendance</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">For: <span className="font-medium">{user?.name}</span></p>
            <p className="text-sm text-gray-500">Current Attendance: <span className="font-medium">{user?.attendanceRate}%</span></p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="present"
                    name="status"
                    type="radio"
                    checked={status === 'present'}
                    onChange={() => setStatus('present')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="present" className="ml-3 block text-sm font-medium text-gray-700">
                    Present
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="absent"
                    name="status"
                    type="radio"
                    checked={status === 'absent'}
                    onChange={() => setStatus('absent')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="absent" className="ml-3 block text-sm font-medium text-gray-700">
                    Absent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="paid"
                    name="status"
                    type="radio"
                    checked={status === 'paid'}
                    onChange={() => setStatus('paid')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="paid" className="ml-3 block text-sm font-medium text-gray-700">
                    Paid
                  </label>
                </div>
              </div>
            </div>

            {status === 'absent' && (
              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for absence
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter reason..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}