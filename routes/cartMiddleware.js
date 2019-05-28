module.exports = function checkCart(req, res, next) {
  if(req.session){
    console.log(req.session)
    if(!req.session.cart){
      req.session.cart = []
      req.session.userId = ''
    }
    next()
  }
}
