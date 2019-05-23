const express = require('express')
const bodyParser = require('body-parser')
const models = require('../models')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

router.post("/add-to-cart/:id", (req, res) => {
    let id = req.params.id
    let cart = req.session.cart

    models.Product.findOne({
        where: {
            id: id
        }
        }).then(product => {
        cart.push(product)
        res.render('shoppingcart', {product:product})
    })
  })

module.exports = router
