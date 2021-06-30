const router = require('express').Router()
const bodyParser = require('body-parser')
const orderController = require('../controllers/order.controller')
const authGuards= require('../guards/auth.guard')
const BP = bodyParser.urlencoded({extended:true})
const check  = require('express-validator').check
const adminGuards= require('../guards/admin.guard')

router.get('/verify' , authGuards.isAuth, adminGuards.notAdmin,orderController.getVerify)

router.get('/order', authGuards.isAuth, adminGuards.notAdmin , orderController.getOrder )

router.post('/order', authGuards.isAuth,BP, 
     check('address').not()
    .isEmpty().withMessage('Please provide an address')
,orderController.postOrder)


router.post('/order/cancel' , authGuards.isAuth , BP , orderController.postDelete)
router.post('/order/cancelAll' , authGuards.isAuth , BP , orderController.postDeleteAll)

module.exports = router


