const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post('/update/:id', upload.single('profilePicture'), async (req, res) => {
    const { name } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = { name };
    if (profilePicture) updateData.profilePicture = profilePicture;

    await User.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/dashboard');
});