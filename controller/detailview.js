const HabitInfo = require('../models/HabitInfo')
const HabitTracker = require('../models/HabitTracker')
var moment = require('moment'); 




module.exports.detailview = async (req, res)=>{

    if(req.isAuthenticated()){
        return res.render('detailview', {title: "Habit Tracker", err: "", msg: ""});
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
    

    
    // const user = await User.find().sort({_id : 1});
    // if(user){
    //     return res.render('introduction');
    // }
    
    
}

module.exports.get_habit_tracker = async(req, res)=>{

    if(req.isAuthenticated()){
        const habittracker = await HabitInfo.find({Routine:req.params.routine, User:req.user.id}).sort({_id : 1}).then(doc=>{
            if(doc){
                n =  new Date();
                y = n.getFullYear();
                m = n.getMonth() + 1;
                d = n.getDate();
    
                res.render('detailview',{document : doc, current_date :  y+'/'+m+'/'+d, routine: req.params.routine, moment : moment , title: "Habit Tracker", err: "", msg: ""});
            }
        })
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
    
    
  
}


    module.exports.habit_data = async(req, res)=>{
        // const habit_data = await HabitInfo.find({_id: req.params.id})
        
        if(req.isAuthenticated()){
            const habitinfo = await HabitInfo.find({_id : req.params.id}).sort({_id : 1}).then(async doc=>{
                if(doc){
                    const habittracker  = await HabitTracker.find({HabitInfo: req.params.id}).then(info =>{
                        console.log(info); 
                    })
                    res.render('dailyhabitpost',{document : doc, title : "Habit Tracker", err: "", msg: ""});
                }
            })
   
        }
        else{
            res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
         }
       
}

module.exports.post_habit_tracker = async(req, res)=>{
    if(req.isAuthenticated()){
        HabitInfo.create({HabitName: req.body.HabitName, StartDate:req.body.StartDate, Routine:req.body.Routine, HighestStreak: req.body.HighestStreak, DoneDays: req.body.DoneDays});
        res.redirect('detailview');
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
    
}

module.exports.post_page = async(req, res)=>{
    if(req.isAuthenticated()){
        return res.render('detailviewpost', {title: "Habit Tracker", err: "", msg: ""});
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
   
}

module.exports.daily_page = async(req, res)=>{

    if(req.isAuthenticated()){
        const details = await HabitInfo.find().sort({_id : 1}).then(doc => {
            if(doc){
                res.render('dailyhabitpost', {document : details, title: "Habit Tracker", err: "", msg : ""});
            }
        })
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
   
    
 }

 //post tracker
module.exports.post_tracker = async(req, res)=>{

    if(req.isAuthenticated()){
        n =  new Date();
        y = n.getFullYear();
        m = n.getMonth() + 1;
        d = n.getDate();
        const tracker_check = await HabitTracker.find({Date: y+'/'+m+'/'+d, HabitInfo: req.params.id}).sort('-date');
        if (!tracker_check.length){
        const details = await HabitTracker.create({ Date :  y+'/'+m+'/'+d,
            Done : "Done",
            HabitInfo: req.params.id}).then(async(doc)=>
            await HabitInfo.findOneAndUpdate({_id : req.params.id}, { $push:{habitTracker: doc._id}}).then(async(doc)=>{
                const find_streak = await HabitTracker.find({HabitInfo: req.params.id}).sort('-createdAt');
                var streak = 0;
                var highest_streak = 0;
                if (find_streak.length == 1){
                        streak =1
                        highest_streak = 1;
                }else{
                var latest_date = find_streak[1].Date;
                var date = moment(latest_date, "YYYY/MM/DD").toDate();
                
    
                // var arr = [];
                // for (var i = 0; i < find_streak.length; i++) {
                //     console.log("date order check")
                //     console.log(find_streak[i].Date)
                //     var date = moment(find_streak[i].Date, "MM/DD/YYYY").toDate();
                //     console.log(date)
                //     console.log(date.getDate())
                //     console.log("date ready")
                //     arr.push(find_streak[i].Date)
                // }
                if(doc.Routine == "Daily"){
                check_prev_day = date.getFullYear()+"/"+date.getMonth()+1+"/"+ date.getDay();
                // var streak_count = 0;
                streak_date = y+"/"+m+"/"+d-1;
                
                if(streak_date == check_prev_day){
                    streak = doc.CurrentStreak + 1;
                    if(streak > doc.HighestStreak){
                        highest_streak = streak
                       }
                    else{
                        highest_streak = doc.HighestStreak;
                    }
                }
                else{
                    streak = 1;
                }
            }
            else{
                if(doc.Routine == "Monthly"){
                   const check_month = date.getMonth()+1;
                   if(check_month == m-1){
                    streak = doc.CurrentStreak + 1;
                    if(streak> doc.HighestStreak){
                        highest_streak = streak;
                    }
                    else{
                        highest_streak = doc.HighestStreak;
                    }
                   } 
                   else{
                    streak = 1;
                   }
    
                }
                else if(doc.Routine == "Weekly"){
                    const check_week = date.getWeek();
                    const week = n.getWeek()-1;
                    if(check_week == week){
                        streak = doc.CurrentStreak + 1;
                        if(streak > doc.HighestStreak){
                            highest_streak = streak;
                        }
                        else{
                            highest_streak = doc.HighestStreak;
                        }
                    }
                    else{
                        streak = 1;
                    }
    
    
                }
            }}
    
                // console.log("year getting error");
                // console.log("no error some issue");
                // while(arr.includes(streak_date)){
                //     streak_count = streak_count + 1;
                //     n = new Date(n.setDate(n.getDate() - 1));
                //     console.log("how many times");
                //     year = n.getFullYear();
                //     month = n.getMonth() + 1;
                //     day = n.getDate();
                //     streak_date = month + "/" + day + "/" + year; 
                //     console.log("how it is done");
                    
                    
    
                // }
            //     console.log(arr);
            //     console.log("streak");
            //     console.log(streak_count);
            //     console.log("streaaaaaaaks");
            //     // for(i in find_streak):
            //     // while(i in find_st)
            //    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            //    console.log(find_streak);
            //    n = new Date(n.setDate(n.getDate() - 1));
            //    console.log("how many times");
            //    year = n.getFullYear();
            //    month = n.getMonth() + 1;
            //    day = n.getDate()-1;
            //    streak_date = month + "/" + day + "/" + year; 
            //    if(arr.includes(streak_date)){
            //     var currnt_streak = doc.CurrentStreak + 1
            //    }else{
            //     var current_streak = 1
            //    }
            //    if(streak_count < doc.HighestStreak){
            //     streak_count = doc.HighestStreak
            //    }
               const update  = await(HabitInfo.findOneAndUpdate({_id:req.params.id}, {CurrentStreak:streak,HighestStreak: highest_streak, DoneDays: find_streak.length,UpdateDate: y+'/'+m+'/'+d }));
               
                }
            ));
        
            res.redirect('/MainPage/Daily');
                
        }
        else{
            res.redirect('/MainPage/Daily');
            }
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }

    
    }


// views
module.exports.post_data = async(req, res)=>{
    
    if(req.isAuthenticated()){
        if(req.body.habit_name){
            await HabitInfo.create({HabitName: req.body.habit_name, StartDate: req.body.start_date, Routine: req.body.routine, UpdateDate:req.body.update_date, User: req.user.id})
            }
            return res.redirect('/MainPage/Daily');
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }
   
}


//update post data
module.exports.update_post_data = async(req, res)=>{  

    if(req.isAuthenticated()){
        const data =  (await HabitTracker.find({HabitInfo: req.body._id}));
        data_length =data.length
        var d = new Date();
        var yesterday = d. setDate(d. getDate() - 1);
        await HabitInfo.updateOne({_id: req.body._id , DoneDays: data});
        return res.render('detailviewpost', {title: "Habit Tracker", err: "", msg: ""})
   
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }

   

}

module.exports.update_screen = async(req, res)=>{
    if(req.isAuthenticated()){
        const data =  await HabitInfo.find({_id: req.params.id});
        return res.render('edit_screen', {data: data[0 ], title: "Update Screen", err: "", msg: ""})
    }
    else{
        res.render('user_sign_in', {title:"User | sign in" , err: "", msg : ""});
        
    }

   
}