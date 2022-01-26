const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const locationSchema = mongoose.Schema({
    latitude:Number,
    longitude:Number
})
const Location = mongoose.model("Location", locationSchema);
const tripSchema = mongoose.Schema({
    car:{
        type:ObjectId,
        require:true,
        ref:"Car"
    },
    type:{
        type:String,
        default:"OUTSTATION",
        enum:["OUTSTATION","LOCAL","AIRPORT"]
    },
    driver:{
        type:ObjectId,
        ref:'Driver'
    },
    start:{...Location},
    end:{...Location},
    status:{
        type:String,
        default:"PENDING",
        enum:["PENDING","CONFIRMED","ON-GOING", "COMPLETED"]
    },
    user:{
        type:ObjectId,
        require:true,
        ref:'User'
    }
},{timeStamps:true});

module.exports = mongoose.model("Trip", tripSchema);