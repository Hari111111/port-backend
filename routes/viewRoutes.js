import express from 'express';
import PageView from '../models/PageView.js';

const router = express.Router();

// Record/Increment a view
router.post('/record', async (req, res) => {
    try {
        const { pagePath, browser, os, device } = req.body;
        if (!pagePath) {
            return res.status(400).json({ message: 'pagePath is required' });
        }

        const updates = { 
            $inc: { count: 1 },
            $set: { lastActive: new Date() }
        };

        // Increment dynamic keys for browser, OS, and device if provided
        if (browser) updates.$inc[`browsers.${browser}`] = 1;
        if (os) updates.$inc[`operatingSystems.${os}`] = 1;
        if (device) updates.$inc[`devices.${device}`] = 1;

        const pageView = await PageView.findOneAndUpdate(
            { pagePath },
            updates,
            { upsert: true, new: true }
        );

        res.status(200).json(pageView);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get views for a specific page
router.get('/count', async (req, res) => {
    try {
        const { pagePath } = req.query;
        if (!pagePath) {
            return res.status(400).json({ message: 'pagePath is required' });
        }

        const pageView = await PageView.findOne({ pagePath });
        res.status(200).json({ count: pageView ? pageView.count : 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all view records (for admin)
router.get('/all', async (req, res) => {
    try {
        const views = await PageView.find().sort({ count: -1 });
        res.status(200).json(views);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
