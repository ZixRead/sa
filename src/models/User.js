import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  image: { 
    type: String 
  },
  department: {
    type: String
  },
  position: {
    type: String
  },
  attendance: [{
    event: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event' 
    },
    status: { 
      type: String, 
      enum: ['present', 'absent', 'paid'], 
      default: 'absent' 
    },
    reason: { 
      type: String 
    },
    markedAt: { 
      type: Date, 
      default: Date.now 
    },
    markedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    processed: { 
      type: Boolean, 
      default: false 
    }
  }],
  attendanceRate: { 
    type: Number, 
    default: 100 
  },
  lastUpdated: { 
    type: Date 
  }
}, { timestamps: true })

// Middleware to calculate attendance rate before saving
UserSchema.pre('save', function(next) {
  if (this.attendance && this.attendance.length > 0) {
    const totalEvents = this.attendance.length
    const presentEvents = this.attendance.filter(a => a.status === 'present').length
    this.attendanceRate = Math.round((presentEvents / totalEvents) * 100)
  }
  this.lastUpdated = new Date()
  next()
})

export default mongoose.models.User || mongoose.model('User', UserSchema)