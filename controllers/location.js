const Location = require('../models/location');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.locationById = (req, res,next, id) => {
    Location.findById(id).exec((err, location) => {
        if(err || !location){
            return res.status(400).json({
                error: "Location not Found"
            })
        }
        req.location = location;
        next();
    })
}

exports.read = (req, res) => {
    return res.json(req.location);
}

exports.create = (req, res) => {
    let location = new Location(req.body);
    location.save((err, location) => {
        if(err || !location){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(location);
    })
}

exports.update = (req, res) =>{
    Location.findByIdAndUpdate(
        {_id: req.location._id},
        {$set: req.body},
        {new:true},
        (err ,location) => {
            if(err || !location){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            return res.json(location);
        }
    )
}

exports.list = (req, res) => {
    Location.find({})
    .sort({"createdAt":-1})
    .exec((err, locations) => {
        if(err || !locations){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(locations)
    })
}

exports.remove = (req, res) => {
    let location = req.location;
    location.remove((err, location) => {
        if(err || !location){
            return res.status(400).json({
                error: "Unable to remove Location"
            })
        }
        return res.json(location);
    })
}