var express = require('express');
var router = express.Router();


// Require our controllers.
var book_controller = require('../controllers/bookController'); 
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');


/** 
 * @swagger
 * components: 
 *     schemas:
 *         Author:
 *             type: object
 *             required:
 *                 - first_name
 *                 - family_name
 *                 - date_of_birth
 *                 - date_of_death
 *             properties:
 *                 id:
 *                     type: integer
 *                     description: The auto-generated id of the author.
 *                 first_name:
 *                     type: string
 *                     description: The name of the book author.
 *                 family_name:
 *                     type: string
 *                     description: The family name of the book author.
 *                 date_of_birth:
 *                     type: date
 *                     description: The date of birth of the book author.
 *                 date_of_death:
 *                     type: date
 *                     description: The day that the book author died.
 *                 example:
 *                     - id: 613bc8724b511e8a13690966
 *                     - first_name: Patrick
 *                     - family_name: Rothfuss
 *                     - date_of_birth: 1973-06-06T00:00:00.000+00:00
 * 
 * 
 *         Book:
 *             type: object
 *             required:
 *                 - title
 *                 - author
 *                 - summary
 *                 - isbn
 *                 - genre
 *             properties:
 *                 id:
 *                     type: integer
 *                     description: The auto-generated id of the author.
 *                 title:
 *                     type: string
 *                     description: The title of the book.
 *                 author:
 *                     type: object
 *                     description: The importing author schema to the book schema.
 *                 summary:
 *                     type: string
 *                     description: The summary of the book .
 *                 isbn:
 *                     type: string
 *                     description: ISBN is the International Standard Book Number is a numeric commercial book identifier which is intended to be unique. Publishers purchase ISBNs from an affiliate of the international ISBn agency. an ISBN is assigned to each separate edition and variation of a publication.
 *                 genre:
 *                    type: object
 *                    description: The importing genre schema to the book schema.
 *                 example:
 *                     - id: 613bc87f4b511e8a13690978
 *                     - title: The Wise Man's Fear (The Kingkiller Chronicle, #2)
 *                     - author: 613bc8724b511e8a13690966
 *                     - summary: Picking up the tale of Kvothe Kingkiller once again, we follow him int...
 *                     - isbn: 9788401352836
 *                     - genre: array
 * 
 * 
 *         BookInstance:
 *             type: object
 *             required:
 *                 - book
 *                 - imprint
 *                 - status
 *                 - deu_back
 *             properties:
 *                 id:
 *                     type: integer
 *                     description: The auto-generated id of the author.
 *                 book:
 *                     type: object
 *                     description: The importing book schema to the book instance schema.
 *                 imprint:
 *                     type: string
 *                     description: The imprint page is the page that appears on the back of the title page. it contains every thing we need to know about who wrote the book, who the publisher is, how we can contact them where the book was printed, what the ISBN is, etc..
 *                 status:
 *                     type: string
 *                     description: The library catalog shows a status for each item indicating whether or not it is available for checkout.
 *                 deu_back:
 *                     type: date
 *                     description: the date at which the book will be returned to the library.
 *                 example:
 *                     - id: 613bc8814b511e8a13690988
 *                     - book: 613bc87f4b511e8a1369097c
 *                     - imprint: New York Tom Doherty Associates, 2016.
 *                     - status: Available
 *                     - due_back: 2021-09-10T21:05:05.902+00:00
 * 
 *         Genre:
 *             type: object
 *             required:
 *                 - name
 *               
 *             properties:
 *                 id:
 *                     type: integer
 *                     description: The auto-generated id of the author.
 *                 name:
 *                     type: string
 *                     description: The name of the genre for the book.
 *                 example:
 *                     - id: 613bc87e4b511e8a13690971
 *                     - name: Fantasy
*/

/**
 * @swagger
 * tags:
 *     name: Books
 *     name2: Authors
 *     name3: BookInstances
 *     name4: Genres
 *     description: The list of all books, authors, book instances, and genres in the library
 */



/// BOOK ROUTES ///

// GET catalog home page.
// router.get('/', book_controller.index);

/**
 * @swagger
 * /book/genre:
 *     get:
 *         summary: Returns the list of books and genres
 *         description: the get request returns the books and the genres in json format if it's it available in database
 *         tags: [Books]
 *         responses:
 *             200:
 *                 description: successful operation
 
 *                 content:
 *                     application/json:
 *                         schemas:
 *                             allOf:
 *                               - $ref: '#/components/schemas/Book'
 *                               - $ref: '#/components/schemas/Genre'
 *                             
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Book' 
 *             404: 
 *                 description: book and genre Not Found       
 * 
 */

// GET request to display Books and genre. 
router.get('/book/genre',book_controller.book_genre_get);

/**
 * @swagger
 * /book/{id}:
 *     get:
 *         summary: Returns a single book
 *         description: get response to retrieve a book by using the id of the book because id is unique to all books
 *         tags: [Books]
 *         operationId: getBookById
 *         parameters:
 *           - in: path
 *             name: id
 *             required: true
 *             schemas:
 *                 allOf:
 *                   - type: integer
 *                   - format: int64 
 *                   - $ref: '#/components/schemas/Book'
 *                   - $ref: '#/components/schemas/Author'
 *                   - $ref: '#/components/schemas/Genre'
 *             description: ID of book to return
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *             400: 
 *                 description: Invalid ID supplied
 *             404: 
 *                 description: Book Not Found                   
 * 
 */

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

/**
 * @swagger
 * /books:
 *     get:
 *         summary: Returns the list of all the books
 *         description: get request retrieve all the books that is available in the library database
 *         tags: [Books]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schemas:
 *                             $ref: '#/components/schemas/Book'
 *                               
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *             404: 
 *                 description: books Not Found        
 * 
 */

// GET request for list of all Book.
router.get('/books', book_controller.book_list);

/**
 * @swagger
 * /book/create:
 *     post:
 *         summary: Creating a new book
 *         description: post request to create a new book in the Library
 *         tags: [Books]
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                          $ref: '#/components/schemas/Book'
 *                 application/xml:
 *                     schema:
 *                         $ref: '#/components/schemas/Book'
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *             404: 
 *                 description: book Not Found        
 * 
 */


// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

/**
 * @swagger
 * /book/{id}/delete:
 *     delete:
 *         tags: [Books]
 *         summary: delete a book
 *         description: delete request to delete a single book from the library
 *         operationId: deleteBook
 *         parameters:
 *           - name: id
 *             in: path
 *             description: ID of book to delete
 *             required: true
 *             schemas:
 *                 allOf:
 *                   - type: integer
 *                   - format: int64 
 *                   - $ref: '#/components/schemas/Book'
 *                   - $ref: '#/components/schemas/Author'
 *                   - $ref: '#/components/schemas/Genre'
 *           - name: additionalMetadata
 *             in: query
 *             description: Additional Metadata
 *             required: false
 *             schema:
 *                 type: string
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 */

// GET request to delete Book.
router.delete('/book/:id/delete',book_controller.book_delete);

/**
 * @swagger
 * /books/delete:
 *     delete:
 *         summary: remove the list of all the books
 *         description: delete request remove all the books that is available in the library database
 *         tags: [Books]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Book'
 *             404: 
 *                 description: books Not Found        
 * 
 */

// DELETE request to delete Book.
router.delete('/books/delete', book_controller.books_delete_all);

/**
 * @swagger
 * /book/{id}/update:
 *     get:
 *        tags:
 *          - Books
 *        summary: Find updated book by ID
 *        description: Returns a single update of a book if available in the library
 *        operationId: getBookById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated book
 *            required: true
 *            schemas:
 *                allOf:
 *                   - type: integer
 *                   - format: int64 
 *                   - $ref: '#/components/schemas/Book'
 *                   - $ref: '#/components/schemas/Author'
 *                   - $ref: '#/components/schemas/Genre'
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Book'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/Book'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: Book not found
 */   
   

// GET request to check the  updated Book.
router.get('/book/:id/update', book_controller.book_update_get);

/**
 * @swagger
 * /book/{id}/update:
 *     put:
 *        tags:
 *          - Books
 *        summary: Find updated book by ID
 *        description: Returns a single update of a book if available in the library
 *        operationId: getBookById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated book
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *        requestBody:
 *            description: Update an existent book in the library
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/Book' 
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Book'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/Book'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: Book not found
 */   

// POST request to update Book.
router.put('/book/:id/update', book_controller.book_update_post);


/// AUTHOR ROUTES ///

/**
 * @swagger
 * /authors:
 *     get:
 *         summary: Returns the list of all the authors
 *         description: get request retrieve all the authors that is available in the library database
 *         tags: [Authors]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *             404: 
 *                 description: Authors Not Found        
 * 
 */

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);


/**
 * @swagger
 * /author/{id}:
 *     get:
 *         summary: Returns a single author
 *         description: get response to retrieve an author by using the id of the authors because id is unique to all books
 *         tags: [Authors]
 *         operationId: getAuthorById
 *         parameters:
 *           - in: path
 *             name: id
 *             required: true
 *             schemas:
 *                 allOf:
 *                   - type: integer
 *                   - format: int64 
 *                   - $ref: '#/components/schemas/Author'
 *             description: ID of author to return
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *             400: 
 *                 description: Invalid ID supplied
 *             404: 
 *                 description: Author Not Found                   
 * 
 */


// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

/**
 * @swagger
 * /author/create:
 *     post:
 *         summary: Creating a new author
 *         description: post request to create a new author in the Library
 *         tags: [Authors]
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/Author'
 *                 application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *             404: 
 *                 description: Author Not Found        
 * 
 */

// POST request for creating Author.
router.post('/author/create', author_controller.author_create);

/**
 * @swagger
 * /author/{id}/update:
 *     get:
 *        tags:
 *          - Authors
 *        summary: Find updated author by ID
 *        description: Returns a single update of an author if available in the library
 *        operationId: getAuthorById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated author
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *     
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Author'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/Author'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: Author not found
 */   

// GET request to check updated Author.
router.get('/author/:id/update', author_controller.author_update_get);

/**
 * @swagger
 * /author/{id}/update:
 *     put:
 *        tags:
 *          - Authors
 *        summary: Find updated author by ID
 *        description: Returns a single update of an author if available in the library
 *        operationId: getAuthorById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated author
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *        requestBody:
 *            description: Update an existent Author in the library
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/Author'
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Author'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/Author'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: Author not found
 */   

// PUT request to update Author.
router.put('/author/:id/update', author_controller.author_update);

/**
 * @swagger
 * /author/{id}/delete:
 *     delete:
 *         tags: [Authors]
 *         summary: delete an author
 *         description: delete request to delete a single author from the library
 *         operationId: deleteAuthor
 *         parameters:
 *           - name: id
 *             in: path
 *             description: ID of an author to delete
 *             required: true
 *             
 *           - name: additionalMetadata
 *             in: query
 *             description: Additional Metadata
 *             required: false
 *             schema:
 *                 type: string
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 */

//  request to delete Author.
router.delete('/author/:id/delete', author_controller.author_delete);

/**
 * @swagger
 * /authors/delete:
 *     delete:
 *         summary: remove the list of all the authors
 *         description: delete request to remove all the authors that is available in the library database
 *         tags: [Authors]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Author'
 *             404: 
 *                 description: Authors Not Found        
 * 
 */

// DELETE request to delete Author
router.delete('/authors/delete', author_controller.author_delete_all);


/// GENRE ROUTES ///

/**
 * @swagger
 * /genres:
 *     get:
 *         summary: Returns the list of all the genres
 *         description: get request to retrieve all the genres that is available in the library database
 *         tags: [Genres]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *             404: 
 *                 description: Genres Not Found        
 * 
 */

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/**
 * @swagger
 * /genre/{id}:
 *     get:
 *         summary: Returns a single genre
 *         description: get response to retrieve a genre by using the id of the genre because id is unique to all books
 *         tags: [Genres]
 *         operationId: getGenreById
 *         parameters:
 *           - in: path
 *             name: id
 *             required: true
 *             schema:
 *               - type: integer
 *               - format: int64 
 *               - $ref: '#/components/schemas/Genre'
 *             description: ID of genre to return
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *             400: 
 *                 description: Invalid ID supplied
 *             404: 
 *                 description: Genre Not Found                   
 * 
 */

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

/**
 * @swagger
 * /genre/create:
 *     post:
 *         summary: Creating a new genre
 *         description: post request to create a new genre of a book in the Library
 *         tags: [Genres]
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/Genre'
 *                 application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *             404: 
 *                 description: Genre Not Found        
 * 
 */

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

/**
 * @swagger
 * /genre/{id}/delete:
 *     delete:
 *         tags: [Genres]
 *         summary: delete a genre
 *         description: delete request to delete a single genre of a book from the library
 *         operationId: deleteGenre
 *         parameters:
 *           - name: id
 *             in: path
 *             description: ID of genre to delete
 *             required: true
 *          
 *           - name: additionalMetadata
 *             in: query
 *             description: Additional Metadata
 *             required: false
 *             schema:
 *                 type: string
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 */


// DELETE request to delete one Genre.
router.delete('/genre/:id/delete', genre_controller.genre_delete);

/**
 * @swagger
 * /genre/delete:
 *     delete:
 *         summary: remove the list of all the Genres
 *         description: delete request to remove all the genre that is available in the library database
 *         tags: [Genres]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/Genre'
 *             404: 
 *                 description: Genres Not Found        
 * 
 */

// DELETE request to delete all Genre.
router.delete('/genres/delete', genre_controller.genre_delete_all);

/**
 * @swagger
 * /genre/{id}/update:
 *     get:
 *        tags:
 *          - Genres
 *        summary: Find updated genre by ID
 *        description: Returns a single update of a genre if available in the library
 *        operationId: getGenreById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated Genre
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *     
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Genre'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/Genre'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: Genre not found
 */   

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

/**
 * @swagger
 * /genre/{id}/update:
 *     put:
 *        tags:
 *          - Genres
 *        summary: Find updated Genre by ID
 *        description: Returns a single update of a genre if available in the library
 *        operationId: getGenreById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated genre
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *        requestBody:
 *            description: Update an existent Genre in the library
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/Genre'
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Genre'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/Genre'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: Genre not found
 */   

// PUT request to update Genre.
router.put('/genre/:id/update', genre_controller.genre_update);


/// BOOKINSTANCE ROUTES ///

/**
 * @swagger
 * /bookinstance/name:
 *     get:
 *         summary: Returns the list of  bookInstance name
 *         description: the get request returns the bookInstance name of the books in the library
 *         tags: [BookInstances]
 *         responses:
 *             200:
 *                 description: successful operation
 
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance' 
 *             404: 
 *                 description: bookInstance name Not Found       
 * 
 */


// GET request for names BookInstance (book list). 
router.get('/bookinstance/name', book_instance_controller.bookinstance_name_get);

/**
 * @swagger
 * /bookinstances:
 *     get:
 *         summary: Returns the list of all the bookInstaces
 *         description: get request retrieve all the bookInstances that is available in the library database
 *         tags: [BookInstances]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *             404: 
 *                 description: BookInstances Not Found        
 * 
 */

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

/**
 * @swagger
 * /bookinstance/{id}:
 *     get:
 *         summary: Returns a single BookInstance
 *         description: get response to retrieve a bookInstance by using the id of the BookInstance because id is unique to all BookInstances
 *         tags: [BookInstances]
 *         operationId: getBookInstanceById
 *         parameters:
 *           - in: path
 *             name: id
 *             required: true
 *             description: ID of bookInstance to return
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *             400: 
 *                 description: Invalid ID supplied
 *             404: 
 *                 description: BookInstances Not Found                   
 * 
 */

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

/**
 * @swagger
 * /bookinstance/create:
 *     post:
 *         summary: Creating a new bookInstance
 *         description: post request to create a new bookInstance in the Library
 *         tags: [BookInstances]
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/BookInstance'
 *                 application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstances'
 *             404: 
 *                 description: BookInstance Not Found        
 * 
 */

// POST request for creating BookInstance.
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

/**
 * @swagger
 * /bookinstance/{id}/delete:
 *     delete:
 *         tags: [BookInstances]
 *         summary: delete a book
 *         description: delete request to delete a single bookInstance from the library
 *         operationId: deleteBookInstance
 *         parameters:
 *           - name: id
 *             in: path
 *             description: ID of bookInstance to delete
 *             required: true
 *             
 *           - name: additionalMetadata
 *             in: query
 *             description: Additional Metadata
 *             required: false
 *             schema:
 *                 type: string
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 */


// GET request to delete BookInstance.
router.delete('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete);

/**
 * @swagger
 * /bookinstances/delete:
 *     delete:
 *         summary: remove the list of all the bookInstances
 *         description: delete request remove all the bookInstances that is available in the library database
 *         tags: [BookInstances]
 *         responses:
 *             200:
 *                 description: successful operation
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *                     application/xml:
 *                         schema:
 *                             $ref: '#/components/schemas/BookInstance'
 *             404: 
 *                 description: bookInstance Not Found        
 * 
 */

// POST request to delete BookInstance.
router.delete('/bookinstances/delete', book_instance_controller.bookinstance_delete_all);

/**
 * @swagger
 * /bookinstance/{id}/update:
 *     get:
 *        tags:
 *          - BookInstances
 *        summary: Find updated bookInstance by ID
 *        description: Returns a single update of a bookInstance if available in the library
 *        operationId: getBookInstanceById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated bookInstance
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *                
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/BookInstance'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/BookInstance'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: BookInstance not found
 */   

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

/**
 * @swagger
 * /bookinstance/{id}/update:
 *     put:
 *        tags:
 *          - BookInstances
 *        summary: Find updated bookInstance by ID
 *        description: Returns a single update of a bookInstance if available in the library
 *        operationId: getBookInstanceById
 *        parameters:
 *          - name: id
 *            in: path
 *            description: ID of updated author
 *            required: true
 *          - name: additionalMetadata
 *            in: query
 *            description: Additional Metadata
 *            required: false
 *        requestBody:
 *            description: Update an existent Author in the library
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/BookInstance'
 *        responses:
 *            200:
 *                description: successful operation
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/BookInstance'
 *                    application/xml:
 *                        schema:
 *                            $ref: '#/components/schemas/BookInstances'
 *            400:
 *                description: Invalid command
 *            404:
 *                description: BookInstances not found
 */   

// POST request to update BookInstance.
router.put('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);



module.exports = router;