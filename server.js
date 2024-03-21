import express from 'express';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));

// Database connection setup
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
import indexRouter from './routes/index.js';
import authorRouter from './routes/authors.js';
import bookRouter from './routes/books.js';

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
