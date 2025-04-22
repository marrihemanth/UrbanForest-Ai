const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scientificName: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    benefits: [{
        type: String,
        required: false
    }],
    imageUrl: {
        type: String,
        required: false
    },
    growthTime: {
        type: String,
        required: false
    },
    suitableClimate: {
        type: String,
        required: false
    },
    co2Absorption: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tree', treeSchema);