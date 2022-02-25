const Tariff = require('../models/tariff');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.tariffById = (req, res, next, id) => {
    Tariff.findOne({_id:id})
    .populate("category" ," -photo")
    .populate("location")
    .exec((err, tariff) => {
        if(err || !tariff){
            return res.status(400).json({
                error:"Tariff not Found"
            })
        }
        req.tariff= tariff;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.tariff);
}

exports.create = (req, res) => {
    let tariff = new Tariff(req.body);
    tariff.save((err, tariff) => {
        if(err || !tariff) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(tariff);
    })
}

exports.list = (req, res) => {
    let q ={isDeleted:false};
    let limit = req.query.limit || 1000;
    let skip = req.query.skip || 0;
    if(req.query.trip || req.query.trip!=="") q['trip_type'] = req.query.trip;
    if(req.query.start || req.query.start!=="") q['location'] = req.query.start;

    Tariff.find(q)
    .limit(limit)
    .skip(skip)
    .populate("category" ," -photo")
    .populate("location")
    .exec((err, tariffs) => {
        if(err || !tariffs){
            return res.status(400).json({
                error: "Unabel to Fetch Tarrifs"
            })
        }
        return res.json(tariffs);
    });
};

exports.listwithquery = (req, res) => {
    Tariff.find({
        location:req.query.start,
        trip_type:req.query.trip,
        sub_trip_type:req.query.subtrip,
        isDeleted:false
    })
    .populate("category" ," -photo")
    .populate("location")
    .exec((err, tariffs) => {
        if(err || !tariffs){
            return res.status(400).json({
                error: "Unabel to Fetch Tarrifs"
            })
        }
        return res.json(tariffs);
    });
}

exports.update = (req,res) => {
    Tariff.findByIdAndUpdate(
        {_id: req.tariff._id},
        {$set : req.body},
        {new: true},
        (err, tariff) => {
            if(err || !tariff){
                return res.status(400).json({
                    error: "Unable to Update Tariff"
                })
            }
            return res.json(tariff);
        }
    )
}

exports.remove = (req, res) => {
    let tariff = req.tariff;
    tariff['isDeleted'] = true;
    tariff.save((err, tariff) => {
        if(err || !tariff){
            return res.status(400).json({
                error:"Unable to delete Tariff"
            })
        }
        return res.json(tariff);
    })
}