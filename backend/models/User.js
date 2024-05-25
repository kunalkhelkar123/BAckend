const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullname:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    mobile:{type:Number, required:true, unique:true},
    password:{type:String},
    isAdmin:{
        type:Boolean,
        default:false
    },
},
{timestamps:true}
);

module.exports = mongoose.model("User",UserSchema);

