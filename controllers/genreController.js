var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

const { body,validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = function(req, res, next) {

  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) { return next(err); }
      // Successful, so render.
      res.send({ title: 'Genre List', list_genres:  list_genres});
    });

};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {

            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({ 'genre': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.send({ title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};


// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate and santise the name field.
    body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.send({ title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                     if (err) { return next(err); }

                     if (found_genre) {
                         // Genre exists, send to its detail page.
                         res.send(found_genre.url);
                     }
                     else {

                         genre.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                        res.send(genre.url);
                         });

                     }

                 });
        }
    }
];

// handle DELETE request to delete one Genre.
exports.genre_delete = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findByIdAndDelete(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            res.send('Successfully deleted a genre.');
        }
    
    });

};


// Handle DELETE request to delete all Genre.

exports.genre_delete_all = function (req, res, next) {
    Genre.deleteMany(function(err){
        if(!err){

            res.send("Successfully deleted all genres.");
        
            
        } else {
            
            res.send(err);

        }
    });
};

// Display Genre update on GET request.
exports.genre_update_get = function(req, res, next) {

    Genre.findById(req.params.id, function(err, genre) {
        if (err) { return next(err); }
        if (genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send( { title: 'Update Genre', genre: genre });
    });

};

// Handle Genre update.
exports.genre_update = [
   
    // Validate and sanitze the name field.
    body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.send({ title: 'Update Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.send(thegenre.url);
                });
        }
    }
];