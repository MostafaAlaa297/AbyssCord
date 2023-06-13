const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    username:{
        type: String,
        required: true,
    },
});
const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
   });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema)
const Room = mongoose.model("Room", roomSchema)



module.exports = {
    User: User,
    Room: Room
}