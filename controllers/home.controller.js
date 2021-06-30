const productsModel = require("../models/product.model")
exports.getHome= (req, res, next)=>{
    let category = req.query.category
    let productsPromise 
    let validCategories= ['T-shirts' , 'Pants', 'Bags', 'Shoes']
    
    if(category && validCategories.includes(category))productsPromise= productsModel.getProductsByCategory(category)
    else productsPromise = productsModel.getAllProducts()


    productsPromise.then(products => {
        res.render('index', {
            isLogged : req.session.userId,
            products: products,
            validationError: req.flash('validationErrors')[0],
            isAdmin: req.session.isAdmin,
            page: "home"
        })
    })

}
