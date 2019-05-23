const express = require('express')
const bodyParser = require('body-parser')
const models = require('../models')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

cartItems = [];

router.post("/add-to-cart/:id", (req, res) => {
    let id = req.params.id

    models.Product.findOne({
        where: {
            id: id
        }
        }).then(product => {
        cartItems.push(product)
        }).then(() => console.log(cartItems))
    })

module.exports = router