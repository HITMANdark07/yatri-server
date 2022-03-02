const tariff = require("../models/tariff");
const Trip = require("../models/trip");


exports.tripById = (req, res, next, id) => {
    Trip.findOne({_id:id})
    .populate({
        path:'tariff',
        populate:{
            path:'category location',
            select:"-photo",
        }
    })
    .populate("driver"," -hashed_password")
    .populate("booked_by","name email image")
    .exec((err, trip) => {
        if(err || !trip){
            return res.status(400).json({
                error:"Trip not Found"
            })
        }
        req.trip= trip;
        next();
    });
};

exports.requestTrip = (req,res) => {
    const {tariff,destination, client_name, client_email, client_request,start, contact, pick_time, pick_date} = req.body;
    if(!tariff || tariff==="" || !destination || destination==="" ||!client_name || client_name==="" || !client_email || client_email==="" || !contact || contact==="" || !start   || start.name=="" || !pick_time || pick_time==="" || !pick_date || pick_date===""){
        return res.status(400).json({
            error:"All Fields are Required"
        })
    }
    let trip = new Trip({
        tariff:tariff,
        client_name:client_name,
        client_email:client_email,
        client_request:client_request,
        pick_time:pick_time,
        pick_date:pick_date,
        contact:contact,
        start:start,
        booked_by:req.user._id
    });

    trip.save((err, trip) => {
        if(err || !trip){
            return res.status(400).json({
                error:"Unable to Create Trip"
            })
        }
        return res.json(trip);
    })

};

exports.list = async(req, res) => {
    let q = {};
    let payload = req.query;
    let limit = payload.limit || 50;
    let skip = payload.skip || 0;
    if(payload.location) {
        q['tariff'] = {};
        q['tariff'].location = payload.location;
    }
    if(payload.status) q['status'] = payload.status;
    let trips;
    try{
        trips = await Trip.find(q)
        .populate({
            path:'tariff',
            populate:{
                path:'category location',
                select:"-photo",
            }
        })
        .populate("car","-image")
        .populate("booked_by","_id name email")
        .limit(limit)
        .skip(skip)
        .sort({"pick_date":-1});
    
    }catch(err){
        return res.status(400).json({
            error:"Something Went Wrong"
        })
    }
    return res.json(trips);
}

exports.read =(req, res) => {
    return res.json(req.trip);
}


exports.update = (req,res) => {
    Trip.findByIdAndUpdate(
        {_id: req.trip._id},
        {$set : req.body},
        {new: true},
        (err, trip) => {
            if(err || !trip){
                return res.status(400).json({
                    error: "Unable to Update Trip"
                })
            }
            return res.json(trip);
        }
    )
}