const User = require('../models/user-model');
const fbConnect = require('../config/facebook-passport');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const querystring = require('querystring');
const mongoose = require('mongoose');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('facebook', new FacebookStrategy(fbConnect,
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ fbId: profile.id }, (err, user) => {
            if (err) {
                done(err);
            }
            if (user) {
                done(null, user);
            }
            else {
                const newUser = new User();

                newUser.fbId = profile.id;
                newUser.meta.firstName = profile.displayName.split(' ')[0];
                newUser.meta.lastName = profile.displayName.split(' ')[1];
                newUser.meta.email = profile.emails != undefined ? profile.emails[0].valueid : '';
                newUser.meta.photo = profile.photos != undefined ? profile.photos[0].value : '';

                newUser.save(function (err) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, newUser);
                });
            }
        });
    }
));

exports.connect = passport.authenticate('facebook')

exports.update = async function (req, res) {
    User.findOne({ fbId: req.body.fbId }, (err, user) => {
        if (err) {
            res.status(500).end();
        }

        if (!user) {
            res.status(404).end();
        }

        user[req.body.toUpdate] = req.body.value;
        user.save(function (err) {
            if (err) {
                res.status(500).end();
            }
            res.status(200).end();
        })
    });
}

exports.delete = function (req, res) {
    User.deleteOne({ fbId: req.body.fbId }, (err) => {
        if (err) {
            res.status(500).end();
        }

        res.status(200).end();
    });

    // Delete other records and benchmarks also !
}

exports.callback = passport.authenticate('facebook');

exports.callbackRedirect = function (req, res) {
    const user = req.user;
    const obj = {
        _id: user._id.toString(),
        firstName: user.meta.firstName,
        lastName: user.meta.lastName,
        email: user.meta.email,
        photo: user.meta.photo,
        showAds: user.showAds,
        weightUnit: user.weightUnit,
        fbId: user.fbId,
        createdDate: user.createdDate.toString()
    };
    res.redirect('/success?' + querystring.stringify(obj));
}