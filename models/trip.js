const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const { MongooseFindByReference } = require('mongoose-find-by-reference');

const tripSchema = mongoose.Schema({
    car:{
        type:ObjectId,
        ref:"Car"
    },
    tariff:{
        type:ObjectId,
        required:true,
        ref:'Tariff'
    },
    client_name:{
        type:String,
        required:true
    },
    client_email:{
        type:String,
        required:true
    },
    client_request:{
        type:String
    },
    destination:{
        type:ObjectId,
        ref:'Location'
    },
    driver:{
        type:ObjectId,
        ref:'Driver'
    },
    contact:{
        type:Number,
        required:true,
    },
    start:{
        name:{
            type:String
        },
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    },
    end:{
        name:{
            type:String
        },
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    },
    last_updated_loc:{
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    },
    distance_travelled:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:"PENDING",
        enum:["PENDING","CONFIRMED","LIVE", "COMPLETED","CANCELED"]
    },
    pick_time:{
        type:String
    },
    pick_date:{
        type:Date,
        default: new Date()
    },
    paymentStatus:{
        type:String,
        default:'UNPAID',
        enum:['UNPAID','PARTIAL','PAID','REFUNDED']
    },
    booked_by:{
        type:ObjectId,
        require:true,
        ref:'User'
    }
},{timeStamps:true});

tripSchema.plugin(MongooseFindByReference);

module.exports = mongoose.model("Trip", tripSchema);