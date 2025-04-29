const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();


// Connexion MongoDB
mongoose.connect("mongodb+srv://blindecoly:coly826@aplicationxy.kaumhiu.mongodb.net/projetstage?retryWrites=true&w=majority&appName=aplicationxy")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("Erreur mongoose :", err));

// Configuration EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));




// Middleware pour les fichiers statiques
app.use('/uploads', express.static('public/uploads'));

// 🔥 Place express-session AVANT les routes
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Middleware pour rendre `user` accessible dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 🔁 Routes
app.use('/', require('./routes/auth'));
app.use('/hotels', require('./routes/hotel'));

app.get('/', (req, res) => {
  res.send('Hello from Node.js on Vercel!');
});


module.exports = app;

app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err);
  res.status(500).send('Erreur interne du serveur.');
});
// Lancement du serveur
app.listen(3000, () => console.log('Server started on http://localhost:3000'));
