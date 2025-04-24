const express = require('express');
const router = express.Router();
const User = require('../models/user');

// หน้าสรุปผล
router.get('/summary', async (req, res) => {
    const users = await User.find();

    const summary = users.map((user) => ({
        name: user.name,
        attendancePercentage: user.attendancePercentage,
        activities: user.activities.map((activity) => ({
            activityId: activity.activityId,
            status: activity.status,
            reason: activity.reason,
        })),
    }));

    res.render('admin/summary', { summary });
});

module.exports = router;