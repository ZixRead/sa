const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    activities: [
        {
            activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
            status: {
                type: String,
                enum: ['มา', 'ไม่มา', 'จ่ายเงินแทน', 'ไม่ว่าง'],
                default: 'มา',
            },
            reason: { type: String, default: '' }, // เหตุผลสำหรับสถานะ "ไม่ว่าง"
            pendingReduction: {
                isPending: { type: Boolean, default: false },
                timestamp: { type: Date, default: null },
            },
        },
    ],
    attendancePercentage: { type: Number, default: 100 }, // เปอร์เซ็นต์การเข้าร่วม
});

module.exports = mongoose.model('User', userSchema);