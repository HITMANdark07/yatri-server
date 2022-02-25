const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const tariffSchema = mongoose.Schema({
    location:{
        type:ObjectId,
        ref:'Location',
        required:true
    },
    category:{
        type:ObjectId,
        ref:'CarCategory',
        required:true
    },
    trip_type:{
        type:String,
        default:"LOCAL",
        enum:["LOCAL", "OUTSTATION","AIRPORT"]
    },
    sub_trip_type:{
        type:String,
        default:"8HRS/80KM",
        enum:["8HRS/80KM","12HRS/120KM","ONEWAY","ROUND_TRIP","CAB_FROM_AIRPORT","CAB_TO_AIRPORT"]
    },
    min_fare:{
        type:Number,
        default:0,
    },
    extra_km:{
        type:Number,
        default:0,
    },
    per_km:{
        type:Number,
        default:0,
    },
    extra_hours:{
        type:Number,
        default:0,
    },
    min_km_per_day:{
        type:Number,
        default:0,
    },
    driver_allowance:{
        type:Number,
        default:0,
    },
    driver_allowance_day:{
        type:Number,
        default:0,
    },
    gst:{
        type:Number,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{ timestamps:true});

module.exports = mongoose.model("Tariff",tariffSchema);