const Tariff = require('../models/tariff');
const Location = require("../models/location");
const { errorHandler } = require("../helpers/dbErrorHandler");
const distance = require('google-distance-matrix');

exports.getInitialPrice = async (req, res) => {
    const { tariffId, destination } = req.body;
    let tariff = await Tariff.findById({_id:tariffId}).populate("location category"," -photo");
    let location = await Location.findById({_id:destination});
    let origin = [`${tariff.location.lat},${tariff.location.lng}`];
    let dest = [`${location.lat},${location.lng}`];
    distance.mode('driving');
    distance.key('AIzaSyATzOQBhRyutho2AlgGTQnsybhNOkuACzI');
    distance.matrix(origin,dest, (err, distance) => {
        if(err){
            return res.distance(400).json({
                error:"Service Unreachable"
            })
        }
        if(!distance){
            return res.distance(400).json({
                error:"Service Unreachable"
            })
        }
        if(distance.status==="OK"){
            let dv = distance.rows[0].elements[0].distance.value;
            let dt = distance.rows[0].elements[0].distance.text;

            let response = {
                estimated_cost:0,
                gst:0,
                car:"",
            }
            let ec = 0;
            let tgst=0;
            switch(tariff.sub_trip_type){
                case "8HRS/80KM":
                     //estimated_cost
                    ec+=tariff.min_fare;
                    tgst = (tariff.gst/100)*ec;
                    response['estimated_cost']=ec;
                    response['gst']=tgst.toFixed(2);
                    response['car'] = tariff.category.title;
                    // local
                    break;
                case "12HRS/120KM":
                    ec+=tariff.min_fare;
                    tgst = (tariff.gst/100)*ec;
                    response['estimated_cost']=ec.toFixed(2);
                    response['gst']=tgst.toFixed(2);
                    response['car'] = tariff.category.title;
                    // local 2
                    break;
                case "ONEWAY":
                    ec+=tariff.per_km*(dv/1000);
                    ec+=tariff.driver_allowance;
                    tgst = (tariff.gst/100)*ec;
                    response['estimated_cost']=ec.toFixed(2);
                    response['gst']=tgst.toFixed(2);
                    response['distance'] = dt;
                    response['car'] = tariff.category.title;
                    response['from'] = tariff.location.name;
                    response['to'] = location.name;
                    // OUTSTAION 
                    break;
                case "ROUND_TRIP":
                    let no_of_days = parseInt((dv/1000)/tariff.min_km_per_day);
                    ec+=tariff.per_km*(dv*2/1000);
                    ec+=tariff.driver_allowance_day*no_of_days;
                    if(tariff.driver_allowance){
                        ec+=tariff.driver_allowance*no_of_days;
                    }
                    tgst+=(tariff.gst/100)*ec;
                    response['estimated_cost']=ec.toFixed(2);
                    response['gst']=tgst.toFixed(2);
                    response['distance'] = dt;
                    response['car'] = tariff.category.title;
                    response['from'] = tariff.location.name;
                    response['to'] = location.name;
                    // OUTSTAION 2
                    break;
                case "CAB_FROM_AIRPORT":
                    // AIRPORT
                    break;
                case "CAB_TO_AIRPORT":
                    // AIRPORT 2
                    break;
                default:
                    return res.status(400).json({
                        error:"Invalid data"
                    })
                    break;
            }

            return res.json(response);
        }
    });
    
}