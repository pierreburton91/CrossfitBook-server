const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useNewUrlParser: true });

// require('./config/passport')(passport);

app.use(compression());
app.use(helmet())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

require('./routes/routes.js')(app);

app.listen(process.env.PORT || 3000, function() {
	console.log('Server is running!');
});
