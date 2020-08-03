var express = require('express');
var router = express.Router();
var passport = require('passport');

var userController = require('../controllers/user');

router.post('/login', passport.authenticate('local'),(req, res, next)=>{
    if(req.isAuthenticated()){
        console.log('YES AUTH')
        console.log(req.session)
    }
    else{
        console.log('NO AUTH')
    }
    res.status(200)
})


router.post('/signup', userController.signup)


module.exports = router;
