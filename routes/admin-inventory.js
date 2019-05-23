const express = require('express')
const bodyParser = require('body-parser')
const models = require('../models')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

  //COPY

  router.post('/admin/admin-inventory', (req, res) => {
    let thumbnail = req.body.image
    let name = req.body.name
    let category = req.body.selectType
    let style = req.body.selectGenre
    let description = req.body.description
    let price = req.body.price
  
    let item = models.Product.build({
      thumbnail: thumbnail,
      name: name,
      category: category,
      style: style,
      description: description,
      price: price
    })
    item.save().then((savedItem) => {
    }).catch(function(err) {
    }).then(function(){
      res.render('admin-inventory')
    })
  })
  
  //View all from db
  router.post('/admin/admin-viewall', (req,res) => {
    models.Product.findAll().then(product => {
      res.render('admin-inventory', {product: product})
    })
  })
  
  //View category from db
  router.post('/admin/admin-viewfiltered', (req,res) => {
    models.Product.findAll({
      where: {
        category: req.body.selectCat}
    }).then(product => {
      res.render('admin-inventory', {product: product})
    })
  })
  
  //admin selects product to update
  router.get('/admin/editproduct/:id', (req,res)=> {
    models.Product.findOne({
        where: {
          id : req.params.id
        }
      }).then((product) => {
        res.render('updatechoice', {product: product})
      })
    })
  
  //admin updates product
  router.post('/admin/updatechoice',(req,res)=>{
    let thumbnail = req.body.image
    let name = req.body.name
    let category = req.body.selectType
    let style = req.body.selectGenre
    let description = req.body.description
    let price = req.body.price
  
    models.Product.update({
        thumbnail: thumbnail,
        name: name,
        category: category,
        style: style,
        description: description,
        price: price
      },{
        where: {
          id: req.body.id
        }
      })
      res.redirect('/admin/admin-inventory')
  })
  
  //admin deletes product
  router.post('/admin/deleteproduct',(req,res)=>{
    models.Product.destroy({
        where: {
          id : req.body.productId
        }
      })
      res.redirect('/admin/admin-inventory')
  })
  

  module.exports = router