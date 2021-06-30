const mongoose = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    price : Number,
    description: String,
    category: String
})
const Product = mongoose.model('product', productSchema)
exports.getAllProducts= () => {
        // connect to db
        //get products
        //disconnect
        return new Promise((resolve , reject)=>{
                mongoose.connect(DB_URL,{ useUnifiedTopology: true ,useNewUrlParser: true }).then(()=>{
                        return Product.find({})
                }).then( products =>{
                     mongoose.disconnect()
                     resolve(products)
                }).catch(err => reject(err))
        })
}


exports.getProductsByCategory= (category) => {
 
        return new Promise((resolve , reject)=>{
                mongoose.connect(DB_URL,{ useUnifiedTopology: true ,useNewUrlParser: true }).then(()=>{
                        //console.log(category);
                        return Product.find({category:category})
                }).then( products =>{
                     mongoose.disconnect()
                     resolve(products)
                }).catch(err => reject(err))
        })
}

exports.getProductsById= (id) => {
 
        return new Promise((resolve , reject)=>{
                mongoose.connect(DB_URL,{ useUnifiedTopology: true ,useNewUrlParser: true }).then(()=>{
                        return Product.findById(id)
                }).then( product =>{
                     mongoose.disconnect()
                     resolve(product)
                }).catch(err => reject(err))
        })
}



exports.addProduct = (data)=>{
        return new Promise ((resolve, reject)=>{
                mongoose.connect(DB_URL,{ useUnifiedTopology: true ,useNewUrlParser: true })
                .then(()=>{
                        let product = new Product(data)
                        return product.save()
                })
                .then((product)=>{
                        mongoose.disconnect()
                        resolve(product)
                })
                .catch(err =>{
                        mongoose.disconnect()
                        reject(err)
                }) 
        })    
}
