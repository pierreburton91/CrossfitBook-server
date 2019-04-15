const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const app = express();

const configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useMongoClient: true });

// require('./config/passport')(passport);

app.use(compression());
app.use(helmet())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
// 	store: new MemoryStore({
// 		checkPeriod: 86400000 // Removes expired entries every 24h
// 	}),
// 	secret: 'crossfitBookisthebestapp',
// 	resave: true,
// 	saveUninitialized: false 
// }));
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

require('./routes/routes.js')(app);

app.listen(process.env.PORT || 3000, function() {
	console.log('App is up and running!!');
});