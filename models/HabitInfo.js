const mongoose = require('mongoose');
const path = require('path');


// crypto = require('crypto');

const HabitInfo = new mongoose.Schema({
    HabitName :{type: String, required: true },
    StartDate : {type: String, required: true},
    Routine : {type: String, required: false},
    CurrentStreak:{type: String, required: false, default: 0},
    HighestStreak : {type: String, required: false, deafult: 0},
    DoneDays : {type: String, required: false, default: 0},
    User: {type: mongoose.Types.ObjectId,
           ref : 'User',
           required: false
            },
    habitTracker : [{
        type: mongoose.Types.ObjectId,
        ref: 'habitTracker',
        required : false
    }],
    UpdateDate:{type: String, required: false}
    },  {timestamps : true
    });


const HabitInfoData = mongoose.model('HabitInfo', HabitInfo);

module.exports = HabitInfoData;