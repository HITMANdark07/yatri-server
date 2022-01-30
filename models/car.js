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
    count:{
        type:Number,
        default:1
    },
    tarrif:{
        type:Number,
        default:100
    },
    location:{
        type:ObjectId,
        ref:'Location',
        required:true
    },
    permit_validity:{
        type:Date,
    },
    insurance_validity:{
        type:Date
    }

},{ timestamps:true});

module.exports = mongoose.model("Car",carSchema);