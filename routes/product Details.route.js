const router = require('express').Router()

const productController = require('../controllers/product.controller')
const homeController = require('../controllers/home.controller')
const authGuards= require('../guards/auth.guard')

router.get('/', homeController.getHome)

router.get('/:id',productController.getProduct)

module.exports = router