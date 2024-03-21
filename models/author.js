import mongoose from 'mongoose';
import Book from './book.js'; // Assuming book.js exports the Book model properly

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// Using async/await for better readability
authorSchema.pre('remove', async function (next) {
    try {
        const books = await Book.find({ author: this._id });
        if (books.length > 0) {
            next(new Error('This author has books still'));
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
