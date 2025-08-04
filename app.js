const express = require('express');
const userRoutes = require('./routes/user.routes');
const indexRoutes = require('./routes/index.routes');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
connectDB();

const app = express();
const { body , validationResult } = require('express-validator')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/', indexRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
