import dbConnect from '@/lib/dbConnect'
import Event from '@/models/Event'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const events = await Event.find({}).sort({ date: -1 })
      res.status(200).json({ success: true, events })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    const session = await getSession({ req })
    
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    if (req.method === 'POST') {
      try {
        const { name, description, date, location, required } = req.body
        const event = await Event.create({
          name,
          description,
          date,
          location,
          required,
          createdBy: session.user.id
        })
        res.status(201).json({ success: true, event })
      } catch (error) {
        res.status(500).json({ success: false, error: error.message })
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ success: false, message: `Method ${req.method} not allowed` })
    }
  }
}