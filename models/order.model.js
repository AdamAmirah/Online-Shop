const { resolveInclude } = require('ejs')
const mongoose = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL
const orderSchema = mongoose.Schema({
    userId: String,
    address: String,
    status: String,
    timestamp: Number,
    product:  {type: Array} 
})

const Order = mongoose.model('order', orderSchema)

exports.addOrder = (data) =>{
    return new Promise ((resolve, reject) =>{
        mongoose.connect(DB_URL ,{ useUnifiedTopology: true ,useNewUrlParser: true } )
        .then(()=>{
            let order = new Order(data)
            return order.save()
        })
        .then((order)=>{
            mongoose.disconnect()
            resolve(order)
        })
        .catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


exports.getOrderByUserId = userId =>{
    //console.log(userId);
    return new Promise ( (resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return Order.find({userId: userId} , {} , {sort:{timestamp:1}})
        })
        .then( order => {
            //console.log(order);
            mongoose.disconnect()
            resolve(order)
        })
        .catch(err => {
            mongoose.disconnect()
             reject(err)
        })

    })
}

exports.getAllOrders= () =>{
    return new Promise ( (resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return Order.find({} , {} , {sort:{timestamp:1}})
        })
        .then( orders => {
            //console.log(order);
            mongoose.disconnect()
            resolve(orders)
        })
        .catch(err => {
            mongoose.disconnect()
             reject(err)
        })

    })
}



exports.deleteOrder = (orderId)=>{
    return new Promise ((resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then( () =>{
            return Order.deleteOne({_id:orderId})
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
            return Order.deleteMany({userId: userId})
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

exports.updateOrder = (id , newData) =>{
    return new Promise ((resolve, reject)=>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(() =>{
                return Order.updateOne({_id:id}, newData)
        })
        .then(order=>{
            mongoose.disconnect()
            resolve(order)
        })
        .catch( err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}



exports.getOrdersByStatus= (status) => {
 
    return new Promise((resolve , reject)=>{
            mongoose.connect(DB_URL,{ useUnifiedTopology: true ,useNewUrlParser: true }).then(()=>{
                    return Order.find({status:status})
            }).then( orders =>{
                 mongoose.disconnect()
                 resolve(orders)
            }).catch(err => reject(err))
    })
}