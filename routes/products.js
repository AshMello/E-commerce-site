const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const sequelize = require('sequelize')
const models = require('../models')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

//js for viewing all products
router.get('/products', (req, res) => {

  models.Product.findAll().then(function(product) {
    res.render('products', {product:product, totalItems: req.session.cart.length})
  })

})

//filter by category
router.get('/products/category/:category', (req, res) => {
  let category = req.params.category
  console.log(req.params.category)

  models.Product.findAll({
   where: {
     category: category}
 }).then(product => {
   res.render('products', {product: product, category: category, totalItems: req.session.cart.length});
 })
});

//filter by style
router.get('/products/style/:style', (req, res) => {
  let style = req.params.style
  console.log(req.params.style)

  models.Product.findAll({
   where: {
     style: style}
  }).then(product => {
   res.render('products', {product: product, style: style, totalItems: req.session.cart.length});
  })
});

router.get('/item/:id/:name', (req, res) => {
  let id = req.params.id

  models.Product.findAll({
   where: {
     id: id
   }
 }).then(product => {
   res.render('item', {product: product, totalItems: req.session.cart.length});
 })
});

module.exports = router
