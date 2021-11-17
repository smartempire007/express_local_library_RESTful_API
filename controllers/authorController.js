var Author = require('../models/author')
var async = require('async')
var Book = require('../models/book')

const { body,validationResult } = require("express-validator");

// Display list of all Authors.
exports.author_list = function (req, res, next) {

    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            // Successful, so render.
            // res.render('author_list', { title: 'Author List', author_list: list_authors });
            res.send({ title: 'Author List', author_list: list_authors })
        })

};

// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
                .exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.send({ title: 'Author Detail', author: results.author, author_books: results.authors_books });
    });

};


// Handle Author create on POST.
exports.author_create = [

    // Validate and sanitize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Author object with escaped and trimmed data
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.send({ title: 'Create Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - send to new author record.
                res.send(author.url);
            });
        }
    }
];



// Display Author delete .
exports.author_delete = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findByIdAndDelete(req.params.id).exec(callback)
        },
        
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.author == null) { // No results.
            res.send("Successfully deleted author.");
        }
        
    });

};
// Handle request for deleting all Authors.

exports.author_delete_all = function (req, res, next) {
    Author.deleteMany(function(err){
        if(!err){

            res.send("Successfully deleted all authors.");
        
            
        } else {
            
            res.send(err);

        }
    });
};




// Display Author update .
exports.author_update_get = function (req, res, next) {

    Author.findById(req.params.id, function (err, author) {
        if (err) { return next(err); }
        if (author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send({ title: 'Update Author', author: author });

    });
};

// Handle Author update on Put.
exports.author_update = [

    // Validate and santize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.send({ title: 'Update Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) { return next(err); }
                // Successful - send to genre detail page.
                res.send(theauthor.url);
            });
        }
    }
];