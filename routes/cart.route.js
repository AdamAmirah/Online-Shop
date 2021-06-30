const router = require('express').Router()
const bodyParser = require('body-parser')
const cartController = require('../controllers/cart.controller')
const authGuards= require('../guards/auth.guard')
const BP = bodyParser.urlencoded({extended:true})
const check  = require('express-validator').check
const adminGuards= require('../guards/admin.guard')


router.get('/cart', authGuards.isAuth, adminGuards.notAdmin , cartController.getCart)

router.post('/cart', authGuards.isAuth , BP ,
    check('amount').not()
    .isEmpty().withMessage('You have to add at least 1 one item to cart')
    .isInt({min:1}).withMessage('You have to add at least 1 one item to cart')
, cartController.postCart)


router.post('/cart/save' , authGuards.isAuth , BP , 
 check('amount').not()
.isEmpty().withMessage('You have to add at least 1 one item to cart')
.isInt({min:1}).withMessage('You have to add at least 1 one item to cart')
, cartController.saveCart)


router.post('/cart/delete' , authGuards.isAuth , BP , cartController.postDelete)
router.post('/cart/deleteAll' , authGuards.isAuth , BP , cartController.postDeleteAll)

module.exports = router


