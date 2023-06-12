const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require ('body-parser')
const ejs = require('ejs')
const {User} = require('./model')
const {Room} = require('./model')
// const bcrypt = require('bcrypt')
// const saltRounds = 10
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
var LocalStrategy = require('passport-local').Strategy;


require("dotenv").config()

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.set('views', __dirname + '/views');
app.set('view engine','ejs')
app.use(express.static('public'))

app.use(session({
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: false, 
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGO_URI)
.then(console.log("connected to the Abysss Hallows"))

app.get(/^\/$|\/register/g,function(req, res){
    res.render('Registeration')
})
// app.get('/register',function(req, res){
//     res.render('Registeration')
// })
app.get('/login',function(req, res){
    res.render('Login')
})
app.get('/lobby',function(req, res){
    if(req.isAuthenticated()){  
    console.log("we are authenticated");  
    res.render('lobby')
    }
    else{
    res.redirect('/login')
    }
})
app.get('/room',function(req, res){
    res.render('room')
})

app.get('/room/:roomId', function(req, res){
    const requestedRoomId = req.params.roomId

    Room.findOne({_id: requestedRoomId}).then(room =>{
        if(room)
        {
            res.render('room', {
                roomName: room.name
            })
        }
        else{
            res.send(`<script>alert("There is no such room!"); window.location.href = "/lobby";</script>`);
        }
    }) 

})

app.post("/register", function(req, res) {
    console.log(" we are at register")
    const newName = req.body.name
    const newEmail = req.body.email

    const userData = {
        name: newName,
        username: newEmail,
    };
    
    User.register(new User(userData), req.body.password,function(err, user)
    {
        if(err)
        {
            console.log(err)
            res.redirect('/register')
        }
        else{
            console.log("user registered");
            passport.authenticate('local',{ failureRedirect: '/lobby' })(req, res, function(err){
                console.log("ma4e");
                res.redirect("/lobby")
            })
        }
    })

    // User.findOne({email: newEmail}).then(user => {
    // if(user){
    //     res.send(`<script>alert("User already exists!"); window.location.href = "/login";</script>`);
    // }else {
        // bcrypt.hash(newPassword, saltRounds, function(err, hash) {
        //     userData.save()
        //     .then(result => console.log(result))
        //     .catch(err => console.error(err));
            
        //     res.redirect('/login')
        // });
    // }}).catch(err => console.error(err))
        
})
app.post("/login", function(req, res) {
    console.log(" we are at login")
    const user = new User({
     username: req.body.email,
     password: req.body.password
    })

    req.login(user, function(err){
        if (err){
            res.redirect('/login')
        }
        else {
            passport.authenticate("local", { failureRedirect: '/lobby' })(req, res, function(){
                res.redirect("/lobby")
            })
        }
    })

    // User.findOne({email: email}).then(user => {
    // if(user){
    //     bcrypt.compare(password, user.password, function(err, result) {
    //         if(result){
    //         res.redirect('/lobby')
    //         console.log(user);
    //         }
    //         else{
    //             res.send(`<script>alert("Wrong Email or Password, please try again!"); window.location.href = "/login";</script>`);
    //         }
    //     });        
    // }else {
    //     res.send(`<script>alert("This Email isn't registered!"); window.location.href = "/login";</script>`);
       // res.redirect("/login")
    // }}).catch(err => console.error(err))
        
})

app.post('/lobby', function(req, res){
    const roomName = req.body.room
    const newRoom = new Room({
        name: roomName
    });
    newRoom.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));
    
    res.redirect(`/room/${newRoom._id}`)
})

app.post("/join_room", function(req, res) {
    const requestedRoomId = req.body.id;
    console.log(requestedRoomId);
    res.redirect(`room/${requestedRoomId}`)
})

const port = process.env.PORT || 3001

app.listen(port, function(){
    console.log(`You are now listning to port ${port}!`)
})