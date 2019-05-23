module.exports = function authenticate(req,res,next) {
  if(req.session) {
    if(req.session.user) {
      next()
    } else {
      res.redirect('/admin-login')
    }
  } else{
    res.redirect('/admin-login')
  }
}
