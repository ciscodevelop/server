const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const listsRouter = require('./routes/lists');

const app = express();
const port = process.env.PORT || 8800;

dotenv.config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL;

mongoose.set('strictQuery', false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connection Established'))
  .catch((err) => console.error(err));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/lists', listsRouter);

app.listen(port, () => {
  console.log(`Backend Server Listening on Port: ${port}`);
});