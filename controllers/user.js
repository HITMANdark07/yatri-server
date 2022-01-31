const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
       if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
        });
     }
        req.user= user;
        next();
    });
};

exports.signUp = (req,res) => {
    
    const user = new User(req.body);
        user.save(async(error, user)=>{
        if (error) {
           return res.status(400).json({
               error:errorHandler(error)
           });
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_USER);
        res.cookie('t', token, {expire: new Date() + 9999})
        user.salt= undefined;
        user.hashed_password = undefined;
        const {_id, name,email, role} = user;
        await res.json({
            user:{_id, name,email, role},
             token
       });
    });
};

exports.listByUser = (req,res) => {
    User.find({role:'USER'}).exec((err, users) => {
        if(err || !users) {
            return res.status(400).json({
                error:"Users not Found"
            })
        }
        return res.json(users);
    })
}
exports.listByCorporate = (req, res) => {
    User.find({role:'CORPORATE'}).exec((err, users) => {
        if(err || !users) {
            return res.status(400).json({
                error:"Users not Found"
            })
        }
        return res.json(users);
    })
}

exports.signin = (req, res) =>{
    //find user based on email
    const {email, password}= req.body;
    User.findOne({email},(err, user)=>{
       if(err || !user) {
           return res.status(400).json({
               error:"user with that email does not exist. please register first"
           });
       }
       // if user is found make sure the email and password match
       // create authenticate method in user model
       if (!user.authenticate(password)){
           return res.status(401).json({
               error: "Incorrect password"
           })
       }

       //generate a signed token with user id and secret
       const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_USER)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with user and token to frontend client 
       const {_id, name, email, role} = user;
       return res.json({
           token,
           user:{ _id, name, email, role}
       });
    });
};

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSigninUser = expressJwt({
    secret: process.env.JWT_SECRET_USER,
    algorithms: ['HS256'] ,
    userProperty:"auth"
});

exports.update = (req, res) => {
    User.findByIdAndUpdate(
        {_id:req.user._id},
        {$set: req.body},
        {new:true},
        (err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: "unable to update"
                })
            }
            return res.json(user);
        }
    )
}

// exports.isuser = (req, res, next) => {
//     let user = req.user && req.auth && req.user._id == req.auth._id;
//     if(!user){
//        return res.status(403).json({ 
//            error: 'Access denied'
//        });
//     }
//     next();
// };


