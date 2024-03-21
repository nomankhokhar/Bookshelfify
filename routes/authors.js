import express from 'express';
import Author from '../models/author.js';
import Book from '../models/book.js';

const router = express.Router();

// All Authors Route
router.get('/', async (req, res) => {
    try {
        let searchOptions = {};
        if (req.query.name) {
            searchOptions.name = new RegExp(req.query.name, 'i');
        }
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

// Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`/authors/${newAuthor.id}`);
    } catch (err) {
        console.error(err);
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
});

// Show Author Route
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            bookByAuthor: books
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Edit Author Route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch (err) {
        console.error(err);
        res.redirect('/authors');
    }
});

// Update Author Route
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch (err) {
        console.error(err);
        if (author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Updating Author'
            });
        }
    }
});

// Delete Author Route
router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch (err) {
        console.error(err);
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);
        }
    }
});

export default router;
