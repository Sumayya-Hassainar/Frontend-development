require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5174', credentials: true })); // adjust in prod

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log('Server up', PORT)))
  .catch(err => console.error(err));
