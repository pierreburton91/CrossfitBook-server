const User = require('../models/user-model');
const Records = require('../models/records-model');
const Benchmarks = require('../models/benchmarks-model');
const fbConnect = require('../config/facebook-passport');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const querystring = require('querystring');
const createDocs = require('../functions/create-docs');
const converWeights = require('../functions/convert-weights');

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
            console.log(err);
            res.status(500).end();
        }

        if (!user) {
            res.status(404).end();
        }

        user[req.body.toUpdate] = req.body.value;
        user.save(function (err) {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
        })
    });

    if (req.body.toUpdate === 'weightUnit') {
        Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            if (!doc) {
                return;
            }

            for (let record of doc.records) {
                
                if (record.unit != "Kg" && record.unit != "Lbs") {
                    return;
                }  else if (record.unit == "Kg" && req.body.value == 0) {
                    return;
                } else if (record.unit == "Lbs" && req.body.value == 1) {
                    return;
                } else {
                    record.unit = req.body.value == 0 ? 'Kg' : 'Lbs';
                    record.history.forEach(item => {
                        item.value = req.body.value == 0 ? converWeights.convertLbsToKg(item.value) : converWeights.convertKgtoLbs(item.value);
                    });
                }
            }

            doc.save(function (err) {
                if (err) {
                    console.log(err);
                }
            })
        });

        Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            if (!doc) {
                return;
            }

            for (let benchmark of doc.benchmarks) {
                if (benchmark.unit != "Kg" && benchmark.unit != "Lbs") {
                    return;
                } else if (benchmark.unit == "Kg" && req.body.value == 0) {
                    return;
                } else if (benchmark.unit == "Lbs" && req.body.value == 1) {
                    return;
                } else {
                    benchmark.unit = req.body.value == 0 ? 'Kg' : 'Lbs';
                    benchmark.history.forEach(item => {
                        item.value = req.body.value == 0 ? converWeights.convertLbsToKg(item.value) : converWeights.convertKgtoLbs(item.value);
                    });
                }
            }

            doc.save(function (err) {
                if (err) {
                    console.log(err);
                }
            })
        })
    }

    res.status(200).end();
}

exports.delete = function (req, res) {
    User.deleteOne({ fbId: req.body.fbId }, (err) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }
    });

    Records.deleteOne({ relatedUserId: req.body._id }, (err) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }
    });

    Benchmarks.deleteOne({ relatedUserId: req.body._id }, (err) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }
    });

    res.status(200).end();
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

    try {
        createDocs.setNewUserRecordsObj(obj._id, Records);
        createDocs.setNewUserBenchmarksObj(obj._id, Benchmarks);
    } catch (err) {
        console.log(err);
    }

    res.redirect('/success?' + querystring.stringify(obj));
}