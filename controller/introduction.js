const User = require('../models/User');

module.exports.get_introuduction_page = async (req, res)=>{
    

    // return res.render('introduction');
   
        return res.render('introduction', {title:"Habit Tracker" , err: "", msg : ""});
    }

    
    
