const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const sequelize = require('sequelize')
const models = require('../models')
const router = express.Router()
const stripe = require('stripe')('sk_test_FQbrqIv7QNIERfJv3watoOv800WshdaZhC');

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:

function cartDescription(itemNames) {
  description = ""
  itemNames.forEach(item => {
    description += item.name
  });
  return description
}


router.post('/charge', (req, res) => {
let name = req.body.name;
let email = req.body.email;
let city = req.body.city;
let line1 = req.body.line1;
let line2 = req.body.line2;
let state = req.body.state;
let zipcode = req.body.postal_code;
let token = req.body.stripeToken;
let cart = req.session.cart
let productsIds = []
for( i=0; i<cart.length; i++) {
  productsIds.push(cart[i].id)
}
(async () => {
  const charge = await stripe.charges.create({
    amount: req.session.total ? req.session.total * 100 : 0,
    currency: 'usd',
    description: cartDescription(req.session.cart),
    source: token,
    receipt_email: email,
    shipping: {
      name: name,
      address:
      {
        city: city,
        line1: line1,
        line2: line2,
        postal_code: zipcode,
        state: state,
      }
      }
    });
})()
.then(() => {
  req.session.destroy()
  console.log(productsIds)
  models.Product.update(
    {
    isAvailable: false
    },
    {
    where: {
      id: productsIds
    }}
  )
  .then(idk => console.log(idk))
  .catch(error => console.log(error))
})
.then(() => res.redirect('/confirmation'))})


// router.post('/customerInfo', (req,res) => {
//   let name = req.body.name;
//   let email = req.body.email;
//   let city = req.body.city;
//   let line1 = req.body.line1;
//   let line2 = req.body.line2;
//   let state = req.body.state;
//   let zipcode = req.body.postal_code;

//   stripe.customers.create({
//     email: email,
//     name: name,
//     shipping: {
//       name: name,
//       address:
//       {
//         city: city,
//         line1: line1,
//         line2: line2,
//         postal_code: zipcode,
//         state: state
//       }
//     }
//     }, function(err, customer) {
//     // asynchronously called
//     }).then(() => {
//       res.redirect('/checkout')
//     })

//   })

//   router.get('/customerInfo', (req, res) => {
//     res.render('customerInfo')
//   })

  router.get('/confirmation', (req, res) => {
    res.render('confirmation')
  })


module.exports = router;
