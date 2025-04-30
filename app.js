const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const serverless = require('serverless-http');
const app = express();

// Connexion MongoDB
// Connexion MongoDB
mongoose.connect("mongodb+srv://blindecoly:coly826@aplicationxy.kaumhiu.mongodb.net/projetstage?retryWrites=true&w=majority&appName=aplicationxy")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("Erreur mongoose :", err));

// Configuration EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Middleware statique
app.use('/uploads', express.static('public/uploads'));

// Session
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
app.use('/', require('./routes/auth'));
app.use('/hotels', require('./routes/hotel'));

// Export pour serverless
module.exports.handler = serverless(app);
