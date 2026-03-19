import express from 'express';
const router = express.Router();
import Question from '../models/Question.js';

// @desc    Get all interview questions
// @route   GET /api/questions
router.get('/', async (req, res) => {
    try {
        const { category, language, difficulty, search, page = 1, limit = 10, type } = req.query;
        let query = {};

        // Search by question or answer (text-based)
        if (search) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { answer: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by multiple categories (if query is category=Frontend,Backend)
        if (category) {
            const categories = category.split(',');
            query.category = { $in: categories };
        }

        // Filter by multiple languages
        if (language) {
            const languages = language.split(',');
            query.language = { $in: languages };
        }

        // Filter by difficulty or type
        if (difficulty) query.difficulty = difficulty;
        if (type) query.type = type;

        // Pagination setup
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Question.countDocuments(query);
        const questions = await Question.find(query)
            .sort({ priority: 1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({ 
            success: true, 
            count: questions.length,
            total,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            },
            data: questions 
        });
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
        const { category, priority } = req.body;

        // Auto priority logic if not provided
        if (!priority) {
            let maxPriority = 0;
            const categories = Array.isArray(category) ? category : (category ? [category] : []);
            
            if (categories.length > 0) {
                const highestPriorityQuestion = await Question.findOne({ 
                    category: { $in: categories } 
                }).sort({ priority: -1 });

                if (highestPriorityQuestion) {
                    maxPriority = highestPriorityQuestion.priority;
                }
            } else {
                // If no category, just get global max priority
                const highestPriorityQuestion = await Question.findOne().sort({ priority: -1 });
                if (highestPriorityQuestion) {
                    maxPriority = highestPriorityQuestion.priority;
                }
            }
            req.body.priority = maxPriority + 1;
        }

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
