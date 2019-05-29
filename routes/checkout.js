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

router.post('/customerInfo', (req,res) => {
  let name = req.body.name;
  let email = req.body.email;
  let city = req.body.city;
  let line1 = req.body.line1;
  let line2 = req.body.line2;
  let state = req.body.state;
  let zipcode = req.body.postal_code;
  console.log(req.body.name)

  stripe.customers.create({
    email: email,
    name: name,
    shipping: {
      name: name,
      address:
      {
        city: city,
        line1: line1,
        line2: line2,
        postal_code: zipcode,
        state: state
      }
    }
    }, function(err, customer) {
    // asynchronously called
    req.session.customerid = customer.id
    req.session.customeremail = customer.email
    console.log(req.session.customerid)
    res.redirect('/checkout')
  })
  })


  router.post('/charge', (req, res) => {
    let token = req.body.stripeToken;
     // Using Express
    (async () => {
      const charge = await stripe.charges.create({
        amount: req.session.total ? req.session.total * 100 : 0,
        currency: 'usd',
        description: cartDescription(req.session.cart),
        source: token,
        receipt_email: req.session.email,
      });
    })();
      res.redirect('/products')
    })

  router.get('/customerInfo', (req, res) => {
    res.render('customerInfo')
  })


module.exports = router;
