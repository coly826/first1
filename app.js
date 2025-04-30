const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const serverless = require('serverless-http');
const path = require('path');
require('dotenv').config();

const app = express();

// MongoDB connection (utilise variable d'env au lieu de hardcode !)
mongoose.connect("mongodb+srv://blindecoly:coly826@aplicationxy.kaumhiu.mongodb.net/projetstage?retryWrites=true&w=majority&appName=aplicationxy")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("Erreur mongoose :", err));

// EJS
app.set('views', path.join(__dirname, '../views')); // important pour que EJS fonctionne depuis /api/
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('../routes/auth'));
app.use('/hotels', require('../routes/hotel'));

// Export Vercel handler
module.exports = app;
module.exports.handler = serverless(app);
