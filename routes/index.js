import express from 'express';
import Book from '../models/book.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
    res.render('index', { books: books });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
