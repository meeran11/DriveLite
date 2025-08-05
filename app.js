const dotenv = require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/user.routes');
const indexRoutes = require('./routes/index.routes');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
connectDB();

const app = express();
const { body , validationResult } = require('express-validator')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// const path = require('path');
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});


app.get("/", (req, res) => {
    res.send("Hello!")
    // res.redirect("/user/login");
  });
//app.use('/', indexRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});


