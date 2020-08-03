
const bcrypt = require('bcryptjs');
const User = require('../models/user');
var passport = require('passport');


// exports.login =  (req, res, next) => {
// 		passport.authenticate('local')
      
// }


exports.signup = (req, res, next) => {
  
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    bcrypt
      .hash(password, 12)
      .then(hashedPw => {
        const user = new User({
          email: email,
          password: hashedPw,
          username: username
        });
        console.log(user)
        return user.save();
      })
      .then(result => {
        res.status(200)
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}