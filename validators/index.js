exports.userSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('email','Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min:4,
        max:32
    });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.driverSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('phone')
    .matches(/^\d{10}$/g)
    .withMessage('Phone number must be of 10 digit')
    .isLength({
        min:10,
        max:10
    })
    .withMessage('Phone number must be of 10 digit')
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    req.check('aadhar_number', 'Aadhar is requried').notEmpty()
    .isLength({
        min:12,
        max:12
    })
    .withMessage("Aadhar must be of 12 digits")
    req.check('dl_number', 'driving license is required').notEmpty()
    req.check('location', 'location is required').notEmpty()
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

