import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({}).sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single service
// @route   GET /api/services/:id
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a service
// @route   POST /api/services
router.post('/', async (req, res) => {
    const { title, icon, description } = req.body;

    try {
        const service = new Service({
            title,
            icon,
            description,
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a service
// @route   PUT /api/services/:id
router.put('/:id', async (req, res) => {
    const { title, icon, description } = req.body;

    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            service.title = title || service.title;
            service.icon = icon || service.icon;
            service.description = description || service.description;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            await service.deleteOne();
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
