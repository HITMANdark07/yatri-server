const mongoose = require('mongoose');


const carCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    seats:{
        type:Number,
        required:true
    },
    photo:{
        data: Buffer,
        contentType:String
    },
    type:{
        type:String,
        default:'mini',
        enum:["mini","prime","standard"]
    },
    ac:{
        type:Boolean,
        default:false,
    },
    luggage:{
        type:Number,
        default:2
    }

},{ timestamps:true});

module.exports = mongoose.model("CarCategory",carCategorySchema);