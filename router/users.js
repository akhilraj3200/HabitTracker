const express = require('express');
const passport = require('passport');
const router = express.Router();
// const auth = require('../config/passport_local_authentication');

const UserController = require('../controller/users');
router.get('/signIn',UserController.user_sign_in_controller);
router.get('/signUp', UserController.user_sign_up_controller);
router.post('/create', UserController.create);
router.post('/create-session', UserController.createSession);
router.post('/signOut', UserController.signout);
router.post('/login', passport.authenticate('local', {failureRedirect: '/user/signIn',successRedirect: '/MainPage/Daily' }));
router.get('/auth/google', passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/MainPage/Daily',failureRedirect : '/user/signIn'}), UserController.createSession);
router.get('/forget_password', UserController.forget_password);
router.post('/change_password', UserController.change_password);
router.post('/send_password_reset_link', UserController.send_password_reset_link);
router.get('/reset_password', UserController.reset_password);
router.post('/change_password_link/:email', UserController.change_password_link);

module.exports = router;