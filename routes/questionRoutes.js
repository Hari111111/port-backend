import express from 'express';
const router = express.Router();
import Question from '../models/Question.js';

// @desc    Get all interview questions
// @route   GET /api/questions
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const questions = await Question.find(query).sort({ priority: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get single interview question
// @route   GET /api/questions/:id
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Create new interview question
// @route   POST /api/questions
router.post('/', async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, data: question });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Update interview question
// @route   PUT /api/questions/:id
router.put('/:id', async (req, res) => {
    try {
        let question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Delete interview question
// @route   DELETE /api/questions/:id
router.delete('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        await question.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
