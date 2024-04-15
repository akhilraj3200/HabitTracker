const express = require('express');
const router = express.Router();
const introController = require('../controller/introduction');
const operations = require('../controller/operations');
const detailView = require('../controller/detailview');
const userView = require('../router/users')
router.get('/',introController.get_introuduction_page);
// router.get('/Detailview', detailView.detailview);
router.get('/MainPage/:routine', detailView.get_habit_tracker);
router.get('/DetailViewPost',detailView.post_habit_tracker);
router.get('/DetailViewPostData', detailView.post_page);
router.get('/DailyHabit', detailView.daily_page);
router.post('/PostHabit', detailView.post_data);
router.get('/PostTracker/:id', detailView.post_tracker);
router.get('/HabitData/:id', detailView.habit_data);
router.get('/delete/:id', operations.delete);
router.post('/update/:id', operations.update);
router.get('/updatescreen/:id', detailView.update_screen);
router.use('/user', userView);


module.exports = router;
