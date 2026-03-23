import express from 'express';
import { generateStructuredJson } from '../utils/ai.js';

const router = express.Router();

router.post('/blog', async (req, res) => {
    try {
        const {
            topic = '',
            category = '',
            audience = '',
            tone = 'Professional',
            keywords = '',
        } = req.body;

        if (!topic.trim()) {
            return res.status(400).json({ message: 'Topic is required.' });
        }

        const prompt = `Create a blog draft for an admin CMS.

Return JSON only with this exact shape:
{
  "title": "",
  "slug": "",
  "category": "",
  "description": "",
  "content": "",
  "tags": [""],
  "image": ""
}

Rules:
- Write high-quality markdown/html-friendly content for the content field.
- Keep description under 170 characters for SEO.
- Generate a clean lowercase slug with hyphens.
- Use the provided category if present.
- Tags should be relevant short keywords.
- If you do not have a real image URL, return an empty string for image.

Inputs:
Topic: ${topic}
Category: ${category || 'Technology'}
Audience: ${audience || 'Developers'}
Tone: ${tone}
Keywords: ${keywords || 'None'}`;

        const result = await generateStructuredJson(prompt);

        res.json({
            success: true,
            model: result.model,
            data: {
                title: result.data.title || '',
                slug: result.data.slug || '',
                category: result.data.category || category || 'Technology',
                description: result.data.description || '',
                content: result.data.content || '',
                tags: Array.isArray(result.data.tags) ? result.data.tags.filter(Boolean) : [],
                image: result.data.image || '',
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to generate blog draft.' });
    }
});

router.post('/question', async (req, res) => {
    try {
        const {
            topic = '',
            category = [],
            language = [],
            type = 'Long',
            difficulty = 'Medium',
        } = req.body;

        if (!topic.trim()) {
            return res.status(400).json({ message: 'Topic is required.' });
        }

        const categories = Array.isArray(category) ? category : [category].filter(Boolean);
        const languages = Array.isArray(language) ? language : [language].filter(Boolean);

        const prompt = `Create an interview question entry for an admin CMS.

Return JSON only with this exact shape:
{
  "question": "",
  "answer": "",
  "category": [""],
  "language": [""],
  "type": "Long",
  "difficulty": "Medium",
  "priority": 0,
  "options": [""]
}

Rules:
- Keep category values only from: Frontend, Backend, Database, DevOps, General, Programming, Other
- Keep language values only from: JavaScript, TypeScript, React.js, Next.js, Node.js, NestJS, MongoDB, PostgreSQL, Python, Java, C++, PHP, HTML/CSS, SQL, Other
- Keep type only from: MCQ, Short, Long
- Keep difficulty only from: Easy, Medium, Hard
- If type is not MCQ, return an empty options array.
- Answer should be detailed and production-useful.

Inputs:
Topic: ${topic}
Preferred categories: ${categories.join(', ') || 'Programming'}
Preferred languages: ${languages.join(', ') || 'JavaScript'}
Type: ${type}
Difficulty: ${difficulty}`;

        const result = await generateStructuredJson(prompt);

        res.json({
            success: true,
            model: result.model,
            data: {
                question: result.data.question || '',
                answer: result.data.answer || '',
                category: Array.isArray(result.data.category) && result.data.category.length
                    ? result.data.category
                    : (categories.length ? categories : ['Programming']),
                language: Array.isArray(result.data.language) && result.data.language.length
                    ? result.data.language
                    : (languages.length ? languages : ['JavaScript']),
                type: result.data.type || type,
                difficulty: result.data.difficulty || difficulty,
                priority: Number.isFinite(Number(result.data.priority)) ? Number(result.data.priority) : 0,
                options: Array.isArray(result.data.options) ? result.data.options.filter(Boolean) : [],
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to generate interview question.' });
    }
});

export default router;
