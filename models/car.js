const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const carSchema = mongoose.Schema({
    reg_number:{
        type:String,
        unique:true,
    },
    type:{
        type:ObjectId,
        ref:"CarCategory"
    },
    image:{
        type:String
    },
    permit_validity:{
        type:Date,
    },
    insurance_validity:{
        type:Date
    }

},{ timestamps:true});

module.exports = mongoose.model("Car",carSchema);