const express = require('express');
const { check } = require('express-validator');
const { getTrees, getTreeById, createTree } = require('../controllers/treeController');
const { protect } = require('../middleware/authMiddleware');

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

module.exports = router;