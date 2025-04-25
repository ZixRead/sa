import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized' })
  }

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const users = await User.find({}).select('-password')
      res.status(200).json({ success: true, users })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, password, role, department, position } = req.body
      
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' })
      }

      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role,
        department,
        position
      })

      res.status(201).json({ success: true, user })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` })
  }
}