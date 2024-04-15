const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto =  require('crypto');
const User = require('../models/User');
const env = require('./environment');

passport.use(new googleStrategy({
    clientID:env.clientid,
    clientSecret: env.clientsecret,
    callbackURL: env.callbackurl
},
function(accessToken, refreshToken, profile, done){
    
User.findOne({email: profile.emails[0].value}).then((user)=>{
   
    console.log(profile);
    console.log(user);

if(user){
  
        return done(null, user);
}
else{
User.create({
    name: profile.displayName,
    email: profile.emails[0].value,
    password: crypto.randomBytes(20).toString('hex')
}).then((user)=>{return done(null, user);}).catch((err)=>{if(err){
    console.log('error in login',err);
    return;

}});

}
}).catch((err)=>{ if(err){ console.log('error in google strategy passport', err); return ;}});

}

));

module.exports = passport;


