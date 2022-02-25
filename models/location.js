const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    lat:{
        type:Number,
        required:true
    },
    lng:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
},{ timestamps: true});

module.exports = mongoose.model('Location',locationSchema);