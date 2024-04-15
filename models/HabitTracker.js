const mongoose = require('mongoose');
const path = require('path');


// crypto = require('crypto');

const habitTracker = new mongoose.Schema({
    Date :{type: String, required: true },
    Done : {type: String, required: true},
    HabitInfo: {
        type: mongoose.Types.ObjectId,
        ref: 'HabitInfo'
    }},
    {timestamps : true
    });


const HabitInfoData = mongoose.model('habitTracker', habitTracker);

module.exports = HabitInfoData;