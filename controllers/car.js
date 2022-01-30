const Car = require('../models/car');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.carById = (req, res, next, id) => {
    Car.findOne({_id:id})
    .populate("type" ," -photo")
    .exec((err, car) => {
        if(err || !car){
            return res.status(400).json({
                error:"Car not Found"
            })
        }
        req.car= car;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.car);
}

exports.create = (req, res) => {
    let car = new Car(req.body);
    car.save((err, car) => {
        if(err || !car) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(car);
    })
}

exports.list = (req, res) => {
    Car.find({})
    .populate("type" ," -photo")
    .populate("location")
    .exec((err, cars) => {
        if(err || !cars){
            return res.status(400).json({
                error: "Unabel to Fetch Cars"
            })
        }
        return res.json(cars);
    });
};

exports.update = (req,res) => {
    Car.findByIdAndUpdate(
        {_id: req.car._id},
        {$set : req.body},
        {new: true},
        (err, car) => {
            if(err || !car){
                return res.status(400).json({
                    error: "Unable to Update Car"
                })
            }
            return res.json(car);
        }
    )
}

exports.remove = (req, res) => {
    let car = req.car;
    car.remove((err, car) => {
        if(err || !car){
            return res.status(400).json({
                error:"Unable to delete car"
            })
        }
        return res.json(car);
    })
}