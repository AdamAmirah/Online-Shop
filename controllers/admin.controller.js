const validationResult = require("express-validator").validationResult
const userModel = require('../models/user.model')
const productsModel = require("../models/product.model")
const orderModel = require('../models/order.model')


exports.getAdd= (req, res,next)=>{
     res.render('add product', {
      validationErrors: req.flash('validationErrors'),
      isLogged : true,
      isAdmin: true,
      page: "adminAdd"
     })
}

exports.postAdd= (req, res,next)=>{
   console.log(validationResult(req).array());
   if(validationResult(req).isEmpty()){
      productsModel.addProduct({
            name: req.body.name,
            price : req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: req.file.filename      
      })
      .then( () => res.redirect('/'))
      .catch( err => {
          next(err)
      }) 
  }
  else{
      req.flash('validationErrors' , validationResult(req).array())
      res.redirect('/admin/add')
  }

}


exports.getOrders = (req, res, next)=>{
    let validstatus= ['pending' , 'completed', 'sent']
    let status = req.query.statusFilter
    if(status && validstatus.includes(status))orderPromise= orderModel.getOrdersByStatus(status)
    else orderPromise = orderModel.getAllOrders(req.session.userId)

    orderPromise
    .then( (orders) =>{
        userModel.getAllUsers()
        .then((users)=>{
            res.render('manage' , {
                isLogged : true, 
                orders : orders,
                validationErrors: req.flash('validationErrors'),
                isAdmin:  true,
                users: users,
                page: "adminOrder"
    
            })
        })
    }).catch(err => next(err))
}

exports.postSave = (req, res, next)=>{
    orderModel.updateOrder ( req.body.orderId , {
        status: req.body.status,
    }) 
    .then( () => {
        res.redirect('/admin/orders')
    })
    .catch((err)=>{
        next(err)    
    })
}