const Tree = require('../models/Tree');
const { validationResult } = require('express-validator');

// Get all trees
const getTrees = async (req, res) => {
    try {
        const trees = await Tree.find().sort('name');
        res.json(trees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trees' });
    }
};

// Get single tree
const getTreeById = async (req, res) => {
    try {
        const tree = await Tree.findById(req.params.id);
        if (!tree) {
            return res.status(404).json({ message: 'Tree not found' });
        }
        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tree' });
    }
};

// Create new tree
const createTree = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const tree = await Tree.create(req.body);
        res.status(201).json(tree);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating tree',
            error: error.message 
        });
    }
};

module.exports = {
    getTrees,
    getTreeById,
    createTree
};