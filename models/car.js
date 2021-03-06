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
    make_model:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    location:{
        type:ObjectId,
        ref:'Location',
        required:true
    },
    booked:{
        type:Boolean,
        default:false,
    },
    permit_validity_from:{
        type:Date,
    },
    permit_validity_to:{
        type:Date,
    },
    insurance_validity_from:{
        type:Date
    },
    insurance_validity_to:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{ timestamps:true});

module.exports = mongoose.model("Car",carSchema);