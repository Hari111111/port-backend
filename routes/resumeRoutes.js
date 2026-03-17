import express from 'express';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user's resume data
// @route   GET /api/resume
// @access  Protected
router.get('/', protect, async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user._id });
        if (resume) {
            res.json(resume.data);
        } else {
            res.status(404).json({ message: 'Resume data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Save/Update user's resume data
// @route   POST /api/resume
// @access  Protected
router.post('/', protect, async (req, res) => {
    try {
        const resumeData = req.body;
        
        let resume = await Resume.findOne({ user: req.user._id });

        if (resume) {
            resume.data = resumeData;
            await resume.save();
            res.json(resume.data);
        } else {
            resume = await Resume.create({
                user: req.user._id,
                data: resumeData
            });
            res.status(201).json(resume.data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
