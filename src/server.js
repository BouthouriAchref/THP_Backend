const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require("morgan");
const config = require('./config/config');
const cors = require('cors');
const port = process.env.PORT || 3000;


const app = express();
app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* CORS */
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));

app.use(passport.initialize());
const passportMiddleware = require('./middleware/passport')
passport.use(passportMiddleware);

app.get('/', function (req, res) {
    return res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// const routes = require('./routes.js');
// app.use('/api', routes);

const AuthRoute = require('./routes/User');
app.use('/api/Auth' ,AuthRoute);

const PlaceRoute = require('./routes/Place');
app.use('/api/Place', PlaceRoute);

const EvaluationRoute = require('./routes/Evaluation');
app.use('/api/evaluation', EvaluationRoute)

mongoose.connect(config.db || process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

connection.on('error', (err) => {
    console.log('MongoDB connection error. please make sure MongoDB is running. ' + err);
    process.exit();
});
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
