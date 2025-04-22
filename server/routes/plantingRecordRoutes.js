const express = require('express');
const { check } = require('express-validator');
const { createPlantingRecord, getUserPlantingRecords } = require('../controllers/plantingRecordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/plant', protect, [
    check('tree').isMongoId(),
    check('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    check('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], createPlantingRecord);

router.get('/records', protect, getUserPlantingRecords);

module.exports = router;