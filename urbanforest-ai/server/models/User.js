const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    plantedTrees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlantingRecord'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);