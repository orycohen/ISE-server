
module.exports = (req, res, next) => {
    if(req.session.admin == true){
    
      next();
    }
    else{
      res.redirect('/login')
    }
      
};
    