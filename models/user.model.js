const mongoose  = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL
const bcrypt  = require('bcrypt')
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        defualt: false
    }
})

const User = mongoose.model ('user' , userSchema)

exports.createUser= (username, email , password)=>{
        return new Promise ((resolve , reject) => {
            mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true }).then(()=>{
                return User.findOne({email:email})
            }).then (user => {
                if(user){
                    mongoose.disconnect()
                    reject("Email exists")
                }
                else return bcrypt.hash(password, 10)
                
            }).then(hashedPassword => {
                  let user = new User ({
                      username : username,
                      email:email,
                      password: hashedPassword,
                      isAdmin: false
                  })
                  return user.save()
            }).then(()=>{
                mongoose.disconnect()
                resolve()
            }).catch(err => {
                mongoose.disconnect()
                reject(err)
            })
        })
}


exports.login = (email, password)=>{
    //console.log("welcome");
    return new Promise ((resolve , reject)=>{
        mongoose.connect(DB_URL ,  { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=> User.findOne({email:email}))
        .then(user =>{
            if(!user){
                mongoose.disconnect();
                reject("this email does not  exist")
            }else{
                bcrypt.compare(password, user.password).then(same =>{
                    if(!same){
                        mongoose.disconnect()
                        reject("password is inncorrect")
                    }else {
                        mongoose.disconnect()
                        resolve({
                            id: user._id,
                            isAdmin: user.isAdmin
                        })
                    }
                })
            }
        }).catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.logout= ()=>{
     return new Promise ((resolve, reject)=>{
         mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
         .then(()=>{
             return find({})
         })
     })  
}


exports.getAllUsers= () =>{
    return new Promise ( (resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return User.find({})
        })
        .then( users => {
            mongoose.disconnect()
            resolve(users)
        })
        .catch(err => {
            mongoose.disconnect()
             reject(err)
        })

    })
}
