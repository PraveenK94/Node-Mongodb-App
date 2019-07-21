const express = require('express');
const router = express.Router();


//@route GET api/Profile
//@desc TEST route
//@access Public

const authCheck = (req, res, next) => {
    try {
        if (!req.user) {
            // if user not logged in 
            res.redirect('/api/auth/login');
        } else {
            // if logged in 
            next();
        }

    } catch (error) {
        console.error(error)

    }


};


router.get('/', authCheck, (req, res) => {
    res.render('profile');
});


module.exports = router;
