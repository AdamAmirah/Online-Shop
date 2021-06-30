const cartModel = require('../models/cart.model')
const validationResult = require("express-validator").validationResult

exports.getCart = (req, res, next)=>{
    
    cartModel.getItemByUserId(req.session.userId)
    .then( (items) =>{
        res.render('cart' , {
            isLogged : req.session.userId, 
            items : items,
            validationError: req.flash('validationErrors')[0],
            isAdmin:  req.session.isAdmin,
            page: "cart"
        })
    }).catch(err =>next(err))
    
}

exports.postCart = (req, res , next) =>{
 //   console.log(req.body);
    if(validationResult(req).isEmpty()){
        //console.log(req.body);
        cartModel.addNewItem( {
            name : req.body.name,
            price :parseInt( req.body.price),
            amount :  parseInt( req.body.amount) ,
            productId: req.body.productId,
            userId: req.session.userId,
            timestamp : Date.now(),
            image: req.body.image
        })
        .then( () => res.redirect(req.body.redirectTo))
        .catch( err => {
            next(err)
        }) 
    }
    else{
        req.flash('validationErrors' , validationResult(req).array())
        res.redirect(req.body.redirectTo)
    }
}



exports.saveCart = (req, res, next) =>{
    if(validationResult(req).isEmpty()){
        cartModel.updateItem ( req.body.cartId , {
            amount: parseInt( req.body.amount) ,
            timestamp:Date.now()
        }) 
        .then( () => {
            res.redirect('/cart')
        })
        .catch((err)=>{
            console.log(err);
            res.redirect('/cart')
        })
    }
    else{
        req.flash('validationErrors' , validationResult(req).array())
        res.redirect('/cart')
    }
}


exports.postDelete = (req ,res, next) =>{
    cartModel.deleteItem(req.body.cartId)
    .then(() =>{
        res.redirect('/cart')
    }).catch((err)=>{
        next(err)
    })
}



exports.postDeleteAll = (req ,res, next) =>{
    cartModel.deleteAll(req.session.userId)
    .then(() =>{
        res.redirect('/cart')
    }).catch((err)=>{
        next(err)
    })
}