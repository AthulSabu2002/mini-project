var express = require('express');
var router = express.Router();


const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login')
  }
  else{
    next()
  }
}

router.get('/', authCheck, function(req, res, next) {
  res.render('home', {name: req.user.username});
});


module.exports = router;
