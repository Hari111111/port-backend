import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// @desc    Get all blogs
// @route   GET /api/blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a blog
// @route   POST /api/blogs
router.post('/', async (req, res) => {
    const { title, slug, image, category, description, content, tags } = req.body;
    console.log(req.body);

    try {
        const blog = new Blog({
            title,
            slug,
            image,
            category,
            description,
            content,
            tags,
        });

        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            await blog.deleteOne();
            res.json({ message: 'Blog removed' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
router.put('/:id', async (req, res) => {
    const { title, slug, image, category, description, content, tags } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            blog.title = title || blog.title;
            blog.slug = slug || blog.slug;
            blog.image = image || blog.image;
            blog.category = category || blog.category;
            blog.description = description || blog.description;
            blog.content = content || blog.content;
            blog.tags = tags || blog.tags;

            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
