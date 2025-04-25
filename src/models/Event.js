import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  date: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String 
  },
  required: { 
    type: Boolean, 
    default: false 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model('Event', EventSchema)