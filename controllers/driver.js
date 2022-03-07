const Driver = require('../models/driver');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signUp = (req,res) => {
    console.log(req.body);
    const driver = new Driver(req.body);
        driver.save(async(err, driver)=>{
        if (err) {
           return res.status(400).json({
               error:errorHandler(err)
           });
        }
        const name = driver.name;
        await res.json({
            message: name+" is added !!"
       });
    });
};

exports.list = (req, res) => {
    let q = {isDeleted:false};
    let qry = req.query;
    if(qry.location) q['location'] = qry.location;
    if(qry.status) q['status'] = qry.status;
    Driver.find(q)
    .sort({"createdAt":-1})
    .populate('location')
    .exec((err, drivers) => {
        if(err || !drivers){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(drivers);
    })
};

exports.signin = (req, res) =>{
    //find admin based on email
    const {phone, password}= req.body;
    Driver.findOne({phone},(err, driver)=>{
       if(err || !driver) {
           return res.status(400).json({
               error:"You are not registered! Contact Admin"
           });
       }
       // if admin is found make sure the email and password match
       // create authenticate method in admin model
       if (!driver.authenticate(password)){
           return res.status(401).json({
               error: "Incorrect password"
           })
       }

       //generate a signed token with admin id and secret
       const token = jwt.sign({_id: driver._id}, process.env.JWT_SECRET_DRIVER)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with admin and token to frontend client 
       driver.salt= undefined;
       driver.hashed_password = undefined;
       return res.json({
           token,
           driver
       });
    });
};

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSigninDriver = expressJwt({
    secret: process.env.JWT_SECRET_DRIVER,
    algorithms: ['HS256'] ,
    userProperty:"auth"
});

exports.isDriver = (req, res, next) => {
    let driver = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!driver){
       return res.status(403).json({ 
           error: 'Access denied!! '
       });
    }
    next();
};

exports.remove = (req, res) => {
    const driver = req.driver;
    driver['isDeleted'] = true;
    driver.save((err, dr) => {
        if(err || !dr){
            res.status(400).json({
                error: "Unable to Remove Driver"
            })
        }
        res.json({
            message: driver.name+" Successfully Removed"
        })
    })
}

exports.update = (req, res) => {
    Driver.findByIdAndUpdate(
        {_id:req.driver._id},
        {$set: req.body},
        {new:true},
        (err, driver) => {
            if(err || !driver){
                return res.status(400).json({
                    error: "Unable to Update Driver"
                })
            }
            return res.json(driver);
        }
    )
}


exports.driverById = (req, res, next, id) => {
    Driver.findById(id).exec((err, driver)=>{
       if(err || !driver) {
         return res.status(400).json({
            error: 'Driver not found'
        });
     }
        req.driver= driver;
        next();
    });
};

exports.read = (req,res) => {
    return res.json(req.driver);
}
