const express = require('express');
const { check } = require('express-validator');
const { getTrees, getTreeById, createTree } = require('../controllers/treeController');
const { protect } = require('../middleware/authMiddleware');
const { recommendTrees } = require('../utils/treeRecommender');

const router = express.Router();

// Public routes
router.get('/', getTrees);
router.get('/:id', getTreeById);

// Protected routes (admin only)
router.post('/', [
    protect,
    check('name').notEmpty().trim(),
    check('scientificName').optional().trim(),
    check('description').optional().trim(),
    check('benefits').optional().isArray(),
    check('imageUrl').optional().isURL(),
    check('growthTime').optional().trim(),
    check('suitableClimate').optional().trim(),
    check('co2Absorption').optional().trim()
], createTree);

// Tree recommendation route
router.post('/recommend', protect, async (req, res) => {
    try {
        const { location, temperature, pollutionLevel, soilType } = req.body;
        const recommendations = recommendTrees({ location, temperature, pollutionLevel, soilType });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tree recommendations', error: error.message });
    }
});

module.exports = router;