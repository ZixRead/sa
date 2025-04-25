import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Event from '@/models/Event'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized' })
  }

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const totalUsers = await User.countDocuments({})
      const totalEvents = await Event.countDocuments({})
      
      const users = await User.find({})
      const avgAttendance = users.reduce((acc, user) => acc + (user.attendanceRate || 0), 0) / totalUsers || 0

      res.status(200).json({ 
        success: true, 
        totalUsers, 
        totalEvents, 
        avgAttendance: Math.round(avgAttendance) 
      })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` })
  }
}