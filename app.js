require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

const compression = require('compression');

const helmet = require('helmet');




// Configuration swagger documentation.

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "LocalLibrary Express API",
      version: "1.0.0",
      description: "This is a simple localLibrary REST API application made with Express and documented with swagger, new book can be added and also it can be removed from the database either by using the id of the book or by deleting all the books, You can also access the author by id or fetch all the author of the books, you can check the genre of the book to know the category where the book fall for example (Fantasy, Fiction, Horror, Romance, Adventure fiction e.t.c) by id or by fetching all the genre.",

      license: {
        name: "apache 2.0",
        url: "http://www.apache.org/license/LICENSE-2.0.html",
      },

      contact: {
        name: "LocalLibrary",
        url: "https://locallibrary.com",
        email: "jcyoung.mjc44@gmail.com",
      },

    },

    servers: [
      {
        url: process.env.LOCAL_URL,
        description: "Development server",
        
      },

      {
        url: process.env.CLOUD_URL,
        description: "production server",
        
      },


    ],
  },

  apis: ["./routes/catalog.js"]
};


const specs = swaggerJsdoc(options);


const app = express();


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {explorer: true})
);


// Set up mongoose connection
const mongoose = require('mongoose');
const dev_db_url = process.env.DEV_DB_URL; /*"mongodb://localhost:27017/local_library";*/

const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(helmet());
app.use(compression()); // Compress all routes

//app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


module.exports = app;