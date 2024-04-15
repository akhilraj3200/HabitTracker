const mongoose = require('mongoose');
const env = require('./environment')
mongoose.connect(env.mongourl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connecting to db'));
db.once('open', function(){
    console.log('successfully connected to the database');
})