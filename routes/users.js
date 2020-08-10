const checkers = require('../middleware');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const debug = require('debug')('app:users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model')('User');

router.post('/login',
    (req, res, next) => {
       debug(`Here with: ${req.body}, or: ${JSON.stringify(req.body)}`);
       if (req.isAuthenticated()) {
         res.sendStatus(200);
       }
       else if (!req.body.password) {
         res.sendStatus(401);
       }
       else {
          next();
       }
    },
    passport.authenticate('local'),
    (req, res) => {
        let user = {name: req.user.name, email: req.user.email, type: req.user.type};
        res.send(user);
    }
)

router.post('/register',
    (req, res, next) => {
       if (req.isAuthenticated()) {
         res.sendStatus(200);
       }
       else {
          next();
       }
    },
    async (req, res) => {
      debug(`${req.path} is requested`);
      try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10)
          await User.create({
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword,
              type: 'Worker'
          });
          debug(`New user registered. Name: ${req.body.name}, email: ${req.body.email}`);
          res.sendStatus(200);
      } catch (error) {
          debug(`Error: ${error}`);
      }
    }
)

router.get('/user', (req, res) => {
    let user;
    if (req.user) {
      user = { name: req.user.name, email: req.user.email, type: req.user.type }
    }
    res.send(user);
});

router.delete('/logout', (req, res) => {
  req.logOut()
  res.send("Thank you");
})

module.exports = router;
