const checkers = require('../middleware');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const debug = require('debug')('app:users');

router.get('/b', (req, res) => {
  //res.render('index.ejs', { name: req.user.name })
    debug(`body is: ${JSON.stringify(req.body)}`);
    res.json({message: "thank you for asking"});
})

router.post('/b', (req, res) => {
  //res.render('index.ejs', { name: req.user.name })
    debug(`body is: ${JSON.stringify(req.body)}`);
    res.json({message: "thank you for posting"});
})

router.get('/', checkers.checkAuthenticated, (req, res) => {
  //res.render('index.ejs', { name: req.user.name })
    debug(`body is: ${JSON.stringify(req.body)}`);
    res.send("Thank you!");
})

router.get('/login', checkers.checkNotAuthenticated, (req, res) => {
  //res.render('login.ejs')
})

router.post('/login', checkers.checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/register', checkers.checkNotAuthenticated, (req, res) => {
  //res.render('register.ejs')
})

router.post('/register', checkers.checkNotAuthenticated, async (req, res) => {
//  try {
    //const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //await User.create({
      //name: req.body.name,
      //email: req.body.email,
      //password: hashedPassword
    //})
    //res.redirect('/login')
  //} catch {
    //res.redirect('/register')
  //}
})

router.delete('/logout', (req, res) => {
  //req.logOut()
  //res.redirect('/login')
})

module.exports = router;
