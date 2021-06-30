const orderModel = require('../models/order.model')
const validationResult = require("express-validator").validationResult
const cartModel = require('../models/cart.model')

exports.getVerify = (req, res, next)=>{
        res.render('verifyOrder' , {
            isLogged : req.session.userId,
            isAdmin:  req.session.isAdmin,
            page: "order"

        })
}

exports.postOrder = (req , res, next)=>{
    if(validationResult(req).isEmpty()){
        cartModel.getItemByUserId(req.session.userId)
        .then((items)=>{
            //console.log(items);
            orderModel.addOrder( {
                userId: req.session.userId,
                address: req.body.address,
                status: "pending",
                timestamp : Date.now(),
                product: items
            })
       
        })
        .then(()=>{
            cartModel.deleteAll(req.session.userId)
        })
        .then( () => res.redirect('/order'))
        .catch( err => {
            next(err)
        })
    }
    else{
        req.flash('validationErrors' , validationResult(req).array())
        res.redirect('/verify')
    }
}


exports.getOrder = (req, res, next)=>{
    orderModel.getOrderByUserId(req.session.userId)
    .then( (orders) =>{
        res.render('orders' , {
            isLogged : req.session.userId, 
            orders : orders,
            statusError: req.flash('statusError'),
            isAdmin:  req.session.isAdmin,
            page: "order"
            
        })
    }).catch(err =>next(err))
}


exports.postDelete = (req ,res, next) =>{
    if(req.body.status === "pending"){
        orderModel.deleteOrder(req.body.orderId)
        .then(() =>{
            res.redirect('/order')
        }).catch((err)=>{
            console.log(err);
            res.redirect('/order')
        })
    }
    else{
        req.flash('statusError' , "error")
        res.redirect('/order')
    }
}

exports.postDeleteAll = (req ,res, next) =>{
    orderModel.deleteAll(req.session.userId)
    .then(() =>{
        res.redirect('/order')
    }).catch((err)=>{
        next(err)
    })
}