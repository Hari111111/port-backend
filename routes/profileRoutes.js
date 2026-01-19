import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// @desc    Get profile (Singleton)
// @route   GET /api/profile
router.get('/', async (req, res) => {
    try {
        // Find the first profile document
        let profile = await Profile.findOne();

        // If no profile exists, return a template/empty one (or create default)
        if (!profile) {
            // Optional: Create a default one automatically
            profile = new Profile({
                name: 'Your Name',
                title: 'Your Title',
                email: 'you@example.com',
                skills: ['Skill 1', 'Skill 2']
            });
            await profile.save();
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update profile
// @route   PUT /api/profile
router.put('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();

        if (!profile) {
            profile = new Profile(req.body);
        } else {
            // Update fields
            profile.name = req.body.name || profile.name;
            profile.title = req.body.title || profile.title;
            profile.email = req.body.email || profile.email;
            profile.phone = req.body.phone || profile.phone;
            profile.location = req.body.location || profile.location;
            profile.about = req.body.about || profile.about;
            profile.resumeLink = req.body.resumeLink || profile.resumeLink;

            if (req.body.socials) profile.socials = req.body.socials;
            if (req.body.skills) profile.skills = req.body.skills;
            if (req.body.interests) profile.interests = req.body.interests;
            if (req.body.experience) profile.experience = req.body.experience;
            if (req.body.education) profile.education = req.body.education;
        }

        const updatedProfile = await profile.save();
        res.json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
