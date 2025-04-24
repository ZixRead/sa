const cron = require('node-cron');
const User = require('../models/user');

cron.schedule('0 * * * *', async () => {
    console.log('Running attendance reduction job...');

    const users = await User.find({
        'activities.pendingReduction.isPending': true,
    });

    const now = new Date();

    for (const user of users) {
        for (const activity of user.activities) {
            if (activity.pendingReduction.isPending) {
                const timeDiff = now - new Date(activity.pendingReduction.timestamp);

                // ถ้าครบ 24 ชั่วโมง (86400000 มิลลิวินาที)
                if (timeDiff >= 86400000) {
                    // ลดเปอร์เซ็นต์เฉพาะกรณี "ไม่มา" เท่านั้น
                    if (activity.status === 'ไม่มา') {
                        user.attendancePercentage -= 10;
                        if (user.attendancePercentage < 0) user.attendancePercentage = 0;
                    }

                    // อัปเดตสถานะ
                    activity.pendingReduction.isPending = false;
                    activity.pendingReduction.timestamp = null;
                }
            }
        }

        await user.save();
    }

    console.log('Attendance reduction job completed.');
});