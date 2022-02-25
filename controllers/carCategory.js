const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const CarCategory = require('../models/carCategory');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.carCategoryById = (req, res, next, id) => {
    CarCategory.findById(id)
    .exec((err, carCategory)=>{
        if(err || !carCategory) {
            return res.status(400).json({
                error:"Category not found"
            });
        } 
        req.carCategory = carCategory;
        next();
    });
};

exports.read = (req, res)=>{
    req.carCategory.photo = undefined;
    return res.json(req.carCategory);
};

exports.list = (req, res) => {
    let q = {isDeleted:false};
    // let qry = req.query;
    CarCategory.find(q)
    .sort({"createdAt":-1})
    .select("-photo")
    .exec((err,carCategories) => {
        if(err || !carCategories){
            return res.status(400).json({
                error:"Unable to Fetch Categories"
            });
        }
        return res.json(carCategories);
    })
}


exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Something Went Wrong'
            });
        }
        const { title, seats,ac,luggage } = fields;

         if(!title || !seats || !ac || !luggage){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }


        let category = new CarCategory(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            // console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'File Size should less than 1mb'
                });
            }
            if(files.photo.filepath){
                category.photo.data = fs.readFileSync(files.photo.filepath);
                category.photo.contentType = files.photo.mimetype;
            }else{
                return res.status(400).json({
                    error: 'File path should be correct'
                });
            }
            category.save((err, result)=>{
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                result.photo=undefined;
                res.json(result);
            });
        }else{
            return res.status(400).json({
                error: 'All fields are required'
            });
        }   
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let category = req.carCategory
        category = _.extend(category, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            category.photo.data = fs.readFileSync(files.photo.filepath);
            category.photo.contentType = files.photo.mimetype;
        }
        category.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            result.photo=undefined;
            res.json(result);
        });
    });
};

exports.remove = (req,res) => {
    let category = req.carCategory;
    category['isDeleted'] = true;
    category.save((err, deletedCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        deletedCategory.photo=undefined;
        res.json(deletedCategory);
    });
};

exports.photo = (req, res, next) => {
    if(req.carCategory.photo.data){
        res.set('Content-Type', req.carCategory.photo.contentType);
        return res.send(req.carCategory.photo.data);
    }
    next();
};