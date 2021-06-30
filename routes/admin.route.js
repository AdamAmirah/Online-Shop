const router = require('express').Router()
const adminController = require('../controllers/admin.controller')
const check  = require('express-validator').check
const bodyParser = require('body-parser')
const BP = bodyParser.urlencoded({extended:true})
const adminGuards= require('../guards/admin.guard')
const authGuards= require('../guards/auth.guard')
const multer = require('multer')
router.get('/admin/add', authGuards.isAuth,  adminGuards.isAdmin, adminController.getAdd)

router.get('/admin/orders', authGuards.isAuth,  adminGuards.isAdmin, adminController.getOrders)

router.post('/admin/orders/save', authGuards.isAuth,  adminGuards.isAdmin, BP ,adminController.postSave)


router.post('/admin/add', authGuards.isAuth,  adminGuards.isAdmin, multer({
    storage: multer.diskStorage({
        destination : (req, file , cb)=>{
            cb(null,'images')
        }, 
        file : (req, file , cb)=>{
            cb(null,Date.now()+'.' + file.originalname)
        }
    })
}).single('image'), 

    check('image').custom((value,{req})=>{
        if(req.file)return true
        else throw 'image is required'
    }),
    check('name').not()
    .isEmpty().withMessage('Product name is required'),

    check('price').not()
    .isEmpty().withMessage('Product price is required')
    .isInt({min:1}).withMessage('Please enter a valid price'),

    check('description').not()
    .isEmpty().withMessage('Product description is required'),

    check('category').not()
    .isEmpty().withMessage('Product category is required')

,adminController.postAdd)



module.exports= router
