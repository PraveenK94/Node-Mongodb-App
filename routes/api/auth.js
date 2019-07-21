const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../../models/User');



//@route GET api/auth
//@desc TEST route
//@access Public


//auth login 
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

//auth logout 
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});




//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//callback route for google to redirect to  

router.get('/google/redirect', passport.authenticate('google'),
    (req, res) => {
        res.redirect('/profile');
    });




router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server error`);
    }
});


//@route Post api/auth
//@description  Authenticate user & get token 
//@access Public


router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()


],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: `Invalid Password` }] });

            }


            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload,
                config.get('jwtKey'),
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });


        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }

    });

module.exports = router;
