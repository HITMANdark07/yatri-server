const Trip = require("../models/trip");


exports.tripById = (req, res, next, id) => {
    Trip.findOne({_id:id})
    .populate("tariff tariff.category" ," -photo")
    .populate("driver"," -hashed_password")
    .populate("user","name email image")
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

}