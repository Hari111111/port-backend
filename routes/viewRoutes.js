import express from 'express';
import PageView from '../models/PageView.js';

const router = express.Router();

// Record/Increment a view
router.post('/record', async (req, res) => {
    try {
        const { pagePath } = req.body;
        if (!pagePath) {
            return res.status(400).json({ message: 'pagePath is required' });
        }

        const pageView = await PageView.findOneAndUpdate(
            { pagePath },
            { $inc: { count: 1 } },
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
