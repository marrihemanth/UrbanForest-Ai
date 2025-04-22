const PlantingRecord = require('../models/PlantingRecord');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create new planting record
const createPlantingRecord = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.log('Authentication error - no user:', req.user);
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log('Request headers:', req.headers);
        console.log('Full request:', {
            body: req.body,
            user: req.user,
            method: req.method,
            path: req.path
        });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { tree, location } = req.body;
        
        // Validate tree ID format
        if (!tree || !tree.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('Invalid tree ID format:', tree);
            return res.status(400).json({ message: 'Invalid tree ID format' });
        }

        // Validate location format
        if (!location || (!location.lat && !location.lng && !Array.isArray(location))) {
            console.log('Invalid location format:', location);
            return res.status(400).json({ message: 'Invalid location format' });
        }

        const locationData = Array.isArray(location) 
            ? { lat: parseFloat(location[0]), lng: parseFloat(location[1]) }
            : { lat: parseFloat(location.lat), lng: parseFloat(location.lng) };

        // Validate parsed location data
        if (isNaN(locationData.lat) || isNaN(locationData.lng)) {
            console.log('Invalid location coordinates:', locationData);
            return res.status(400).json({ message: 'Invalid location coordinates' });
        }

        console.log('Creating record with data:', {
            user: req.user.id,
            tree,
            location: locationData
        });

        const record = await PlantingRecord.create({
            user: req.user.id,
            tree,
            location: locationData
        });

        // Add to user's planted trees
        await User.findByIdAndUpdate(req.user.id, {
            $push: { plantedTrees: record._id }
        });

        const populatedRecord = await PlantingRecord.findById(record._id)
            .populate('tree', 'name image pollutionReduction');

        return res.status(201).json(populatedRecord);
    } catch (error) {
        console.error('Planting record error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({ 
            message: 'Error creating planting record',
            error: error.message
        });
    }
};

// Get user's planting records
const getUserPlantingRecords = async (req, res) => {
    try {
        const records = await PlantingRecord.find({ user: req.user.id })
            .populate('tree', 'name image pollutionReduction')
            .sort('-date');
            
        // Ensure each record has valid location data
        const validatedRecords = records.map(record => {
            if (!record.location || (!record.location.lat && !record.location.lng)) {
                return null;
            }
            return record;
        }).filter(record => record !== null);
        
        res.json(validatedRecords);
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching planting records');
    }
};

module.exports = {
    createPlantingRecord,
    getUserPlantingRecords
};