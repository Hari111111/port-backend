import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single project
// @route   GET /api/projects/:id
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a project
// @route   POST /api/projects
router.post('/', async (req, res) => {
    const { title, image, description, technologies, liveUrl, githubUrl, featured } = req.body;

    try {
        const project = new Project({
            title,
            image,
            description,
            technologies,
            liveUrl,
            githubUrl,
            featured,
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
router.put('/:id', async (req, res) => {
    const { title, image, description, technologies, liveUrl, githubUrl, featured } = req.body;

    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.title = title || project.title;
            project.image = image || project.image;
            project.description = description || project.description;
            project.technologies = technologies || project.technologies;
            project.liveUrl = liveUrl || project.liveUrl;
            project.githubUrl = githubUrl || project.githubUrl;
            project.featured = featured !== undefined ? featured : project.featured;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
