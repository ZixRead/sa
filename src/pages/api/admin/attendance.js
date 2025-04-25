import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized' })
  }

  await dbConnect()

  if (req.method === 'POST') {
    try {
      const { userId, eventId, status, reason } = req.body

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      // Check if attendance for this event already exists
      const existingAttendanceIndex = user.attendance.findIndex(
        a => a.event.toString() === eventId
      )

      const attendanceRecord = {
        event: eventId,
        status,
        reason: status === 'absent' ? reason : '',
        markedBy: session.user.id,
        markedAt: new Date()
      }

      if (existingAttendanceIndex >= 0) {
        // Update existing record
        user.attendance[existingAttendanceIndex] = attendanceRecord
      } else {
        // Add new record
        user.attendance.push(attendanceRecord)
      }

      await user.save()

      res.status(200).json({ success: true, user })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` })
  }
}