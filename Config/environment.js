const fs = require('fs');
const rfs = require("rotating-file-stream");

const path = require('path');
const LogDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(LogDirectory) || fs.mkdirSync(LogDirectory);


const AccesslogStream = rfs.createStream('access.log',{
  interval:'1d',
  path:LogDirectory
})



const development = {name : "development", asset_path : '/assets', session_secret : 'keyboard cat', mongourl : 'mongodb://127.0.0.1:27017/HabitTracker', dbname : 'codial',
clientid: "954588117269-b113o2ti1er4rdl6n4fk56sefq44m1st.apps.googleusercontent.com", clientsecret : "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", callbackurl : "http://localhost:8000/user/auth/google/callback",
email_user_name: 'uchiha.sasuke.ly3200@gmail.com', email_password: 'tlpk pdjo rvqa pedo', morgan: {mode: 'dev', options:{stream: AccesslogStream}}}
const production = {name : "production", asset_path: process.env.asset_path, session_secret: process.env.session_secret, mongourl: process.env.mongourl, dbname: process.env.dbname,
clientid: process.env.clientid, clientsecret: process.env.clientsecret, callbackurl: process.env.callbackurl, email_user_name: process.env.email_user_name, email_password : process.env.email_password,
morgan: {mode: 'combined', options:{stream: AccesslogStream}}
}

module.exports = eval(process.env.CODIAL_ENVIRONMENT)== undefined? development : eval(process.env.CODIAL_ENVIRONMENT);