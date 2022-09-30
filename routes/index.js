const express = require('express');
const router = express.Router();
const Book = require('../models/book');


router.get('/', async (req,res) => {
    let books;
    try {
        books = await Book.find().find().sort({createdAt : "desc"}).limit(10).exec();
    } catch  {
        books = [];
    }
    res.render('index', {books : books });   // render mean file rendering
})

// Upper and Lower Both are Same

// router.route('/').get((req,res)=>{
//     res.send('Hello Jan');
// })

module.exports = router;