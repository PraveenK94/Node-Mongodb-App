const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/User')


passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(new GoogleStrategy({
    //options for the google strategy 
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'http://localhost:5000/api/auth/google/redirect'

}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    //check if user already exists
    try {
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                //already user eixts 
                console.log('user is :', currentUser);
                done(null, currentUser);
            } else {
                //if not , create user 
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    avatar: profile.photos,
                    email: profile.emails
                }).save().then((newUser) => {
                    console.log('new user created:' + newUser);
                    done(null, newUser);
                })
            }


        }
        )
    } catch (err) {
        console.error(err)

    }
    //passport callBack Function
    console.log("Passport callback function fired!!!");
    console.log(profile);



})
)
