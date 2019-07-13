const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
//user mongoose models
const User = require('../../models/User');
//@route Post api/users
//@desc Register user
//@access Public


router.post('/', [
    check('firstname', 'First Name is required').not().isEmpty(),
    check('lastname', 'Last Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with min 6 character').isLength({ min: 6 }),
    check('mobilenumber', 'Plese enter ur mobile number').isLength({ min: 10 }),
    check('address', 'Please Enter your Address').not().isEmpty()

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); e
        }

        const { firstname, lastname, email, mobilenumber, password, address } = req.body;

        try {
            let user = await User.findOne({ email, mobilenumber });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already Exists' }] });
            }
            //see if user exits
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                firstname,
                lastname,
                email,
                password,
                mobilenumber,
                address,
                avatar
            });
            //get users photo

            //Encrypyt password 
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();


            //return jsonweebtoken
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
