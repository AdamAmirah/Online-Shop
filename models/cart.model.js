const { resolveInclude } = require('ejs')
const mongoose = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL
const cartSchema = mongoose.Schema({
    name: String,
    price : Number,
    amount : Number,
    userId: String,
    productId: String,
    timestamp: Number,
    image: String
})

const CartItem = mongoose.model('cart', cartSchema)

exports.getItemByUserId = userId =>{
    return new Promise ( (resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return CartItem.find({userId: userId} , {} , {sort:{timestamp:1}})
        })
        .then( items => {
            mongoose.disconnect()
            resolve(items)
        })
        .catch(err => {
            mongoose.disconnect()
             reject(err)
        })

    })
}

exports.addNewItem = (data)=>{
    return new Promise( (resolve , reject) =>{
        mongoose.connect(DB_URL ,{ useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return CartItem.findOne({productId: data.productId})
        })
        .then((curr)=>{
            if(!curr){
                let item = new CartItem(data)
                return item.save()
            }
            else{
                data.amount+= curr.amount
                return CartItem.updateOne({_id:curr._id}, data)
            }
        })
        .then((items)=>{
            mongoose.disconnect()
            resolve(items)
        })
        .catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })

}

exports.updateItem = (id , newData) =>{
    return new Promise ((resolve, reject)=>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(() =>{
                return CartItem.updateOne({_id:id}, newData)
        })
        .then(items=>{
            mongoose.disconnect()
            resolve(items)
        })
        .catch( err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.deleteItem = (cartId)=>{
    return new Promise ((resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then( () =>{
            return CartItem.deleteOne({_id:cartId})
        })
        .then(() =>{
            mongoose.disconnect()
            resolve()
        })
        .catch( err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


exports.deleteAll = (userId)=>{
    return new Promise ((resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then( () =>{
            return CartItem.deleteMany({userId: userId})
        })
        .then(() =>{
            mongoose.disconnect()
            resolve()
        })
        .catch( err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


