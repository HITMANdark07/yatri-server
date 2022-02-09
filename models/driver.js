const mongoose = require('mongoose');
const crypto = require('crypto');
const ObjectId = mongoose.Schema.ObjectId;
const uuidv1 = require('uuid/v1');
// const autoIncrement = require('mongoose-auto-increment');

// autoIncrement.initialize(mongoose.connection);

const driverSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    location:{
        type:ObjectId,
        ref:'Location',
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:Number,
        default:1
    },
    phone:{
        type:String,
        unique:true,
        trim:true,
        minlength:10,
        maxlength:10,
    },
    hashed_password:{
        type:String,
        required:true,
    },
    aadhar_number:{
        type:String,
        required:true,
        minlength:12,
        maxlength:12,
        unique:true
    },
    dl_number:{
        type:String,
        required:true,
        unique:true
    },
    about:{
        type:String,
        trim: true
    },
    salt:String,
    image:{
        type:String,
        trim:true
    },
    history:{
        type:Array,
        default:[]
    }
}, {timestamps:true}
);

//Autoincrement Plugin
// driverSchema.plugin(autoIncrement.plugin,'Driver');

//virtual field

driverSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt =uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
});

driverSchema.methods = {
    authenticate : function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        }catch(err){
            return "";
        }
    }
};

module.exports = mongoose.model('Driver', driverSchema);