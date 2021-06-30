const express = require("express")
const app = express()
const path = require ("path")


const session = require('express-session')
const SessionStore = require('connect-mongodb-session')(session)
const cookieParser=require('cookie-parser')
const flash = require ('connect-flash')

const homeRouter = require('./routes/home.route')
const productRouter = require('./routes/product Details.route')
const authRouter = require('./routes/auth.route')
const cartRouter= require('./routes/cart.route')
const orderRouter = require('./routes/order.route')
const adminRouter = require('./routes/admin.route')

const config = require('./config.json');
app.use (express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(cookieParser('keyboard cat'));
app.use(session());
app.use(flash())

const STORE = new SessionStore ({
     uri:config.DB_URL,
     collection: 'sessions'

})


app.use(session({
    secret: "this Amirah's first website",
    saveUninitialized: false,
    store : STORE
     
}))

app.set("view engine" , "ejs")
app.set('views' , 'views') // defualt


app.use('/', homeRouter)
app.use('/product' , productRouter)
app.use('/' , authRouter )
app.use('/', cartRouter)
app.use('/', orderRouter)
app.use('/', adminRouter)
app.use((error , req, res, next)=>{
    res.redirect('/error')
})



/////
app.get("/error" , (req, res,next)=>{
    res.status(500)
    res.render('500.ejs', {
        isLogged : req.session.userId,
        isAdmin: req.session.isAdmin, 
    })
})

app.get("/not-admin" , (req, res,next)=>{
    res.status(403)
    res.render('403.ejs', {
        isLogged : req.session.userId,
        isAdmin: false 
    })
})


app.use((req, res,next)=>{
    res.status(404)
    res.render('404.ejs')
})


const port  = process.env.PORT || 3000

app.listen(port, (err)=>{
    console.log("Listening from port 3000");
})