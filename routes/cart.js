const express = require('express')
const bodyParser = require('body-parser')
const models = require('../models')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

//functions for calculating number of cart items and cost subtotal

function cartSubtotal(cart) {
  let subtotal = 0
  if (cart) {
    cart.forEach(function(item) {
      subtotal += item.price
    })
  } return subtotal
}

router.post("/add-to-cart/:id", (req, res) => {
    let id = req.params.id
    let cart = req.session.cart

    models.Product.findOne({
        where: {
            id: id
        }
        }).then(product => {
        cart.push(product)
        res.redirect('/shoppingcart')
    })
  })

router.get('/shoppingcart', (req, res) => {
  let subtotal = cartSubtotal(req.session.cart)

  res.render('shoppingcart', {cartItems: req.session.cart, subtotal: subtotal, totalItems: req.session.cart.length})
})

router.post('/delete-item', (req, res) => {
  let deleteId = req.body.id

  req.session.cart = req.session.cart.filter(function(item) {
    return item.id != deleteId
  })

  res.render('shoppingcart')
})

module.exports = router
