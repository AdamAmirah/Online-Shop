const productsModel = require("../models/product.model")

exports.getProduct= (req,res,next)=>{
    let id = req.params.id
    productsModel.getProductsById(id).then(product => {
        res.render('product Details', {
            product: product,
            isLogged : req.session.userId,
            isAdmin:  req.session.isAdmin,
            page: "home"

        })
    })
}
