import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false })
  }

  await dbConnect()

  try {
    // Find users with unprocessed absences older than 1 day
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const users = await User.find({
      'attendance': {
        $elemMatch: {
          status: 'absent',
          markedAt: { $lte: oneDayAgo },
          processed: { $ne: true }
        }
      }
    })

    let processedCount = 0

    for (const user of users) {
      let needsUpdate = false
      
      const updatedAttendance = user.attendance.map(record => {
        if (record.status === 'absent' && 
            record.markedAt <= oneDayAgo && 
            !record.processed) {
          needsUpdate = true
          return { ...record.toObject(), processed: true }
        }
        return record
      })

      if (needsUpdate) {
        await User.updateOne(
          { _id: user._id },
          { $set: { attendance: updatedAttendance } }
        )
        processedCount++
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Processed ${processedCount} users` 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}