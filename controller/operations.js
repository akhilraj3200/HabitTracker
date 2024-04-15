const HabitInfo = require('../models/HabitInfo')
const HabitTracker = require('../models/HabitTracker')


module.exports.update = async(req, res)=>{  
    await HabitInfo.findOneAndUpdate({_id: req.params.id }, {HabitName: req.body.HabitName, Routine: req.body.Routine});
    return res.redirect('/MainPage/'+ req.body.Routine)
 
 }

module.exports.delete = async(req, res)=>{
    try{
    const data = await HabitTracker.deleteMany({HabitInfo: req.params.id});
    console.log(data);
    const data2 = await HabitInfo.deleteMany({_id: req.params.id});
    return res.redirect('/MainPage/Daily');
    }
    catch(e){
        return res.redirect('/MainPage/Daily');
    }

}  