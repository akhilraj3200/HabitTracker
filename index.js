const express = require('express');
const bodyParser = require('body-parser')
const SaasMiddleware = require('node-sass-middleware')
const db = require('./Config/mongoose')
const path = require('path');

const User = require('./models/User')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const login = require('./Config/passport_middleware');
const MongoStore = require('connect-mongo');

const bcrypt = require('bcrypt')

var SQLiteStore = require('connect-sqlite3')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var env = require('./Config/environment');
const logger = require('morgan');






const app = express();
require('./Config/view_helpers')(app)


const port = 8000;

app.use('/uploads',express.static(path.join(__dirname, '/uploads')));
app.use('/assets/js',express.static(path.join(__dirname, env.asset_path, "js")));

path.join(__dirname, env.asset_path, "css")

if(env.name == 'development'){
app.use(SaasMiddleware({
    src:path.join(__dirname, env.asset_path, "scss"),
    dest:path.join(__dirname, env.asset_path, "css"),
    debug:true,
    outputStyle: 'extended',
    prefix: '/css'
}));
}


app.use(express.static('assets'));
app.use('/',express.static(path.join(__dirname, env.asset_path)));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: env.mongourl,
    dbName: env.dbname,
    autoRemove: 'interval',
    autoRemoveInterval: 10
  })}));
app.use(passport.authenticate('session'));
app.use(expressLayouts); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(logger(env.morgan.mode, env.morgan.options))

const data = require('./Config/passport_middleware').pasport_login;
// const PassportJWTStrategy = require("./config/passport_jwt_authentication")
const PassportGoogle = require("./config/googleoauth")
var strategy = new LocalStrategy({ usernameField: 'email' },(email, password, done) =>{
    //to do
    User.findOne({email: email}).then(async(user)=>{
        if(user){
            const match = await bcrypt.compare(password, user.password);

            if(!match){
                return done(null, false);
            } 
            return done(null, user);
        }
        else{
            return done(null, false);
        }
       
    }).catch((err)=>{return done(err);})

    
})
passport.use(strategy);



passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
     
      return cb(null, user);
    });
  });
  passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
     
        return next();
    }
    return res.redirect('/user/signIn')
  }
  passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
        // res.cookie('user_id',result.id)
        // req.flash('success', 'User login Successfully');
        // console.log(res.locals.flash)
        // console.log(req.flash)
    }
  }

app.set('views', './views');
app.set('view engine', 'ejs');
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);








app.listen(port, (err)=>{
    if(err){
        console.log("error in starting port: ", port);
    }
    console.log("server started at port: ", port);
})

app.use('/', require('./router/index'));