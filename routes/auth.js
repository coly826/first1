const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');  // Ajout pour l'envoi d'e-mails
const User = require('../models/User');

const router = express.Router();

// Configuration Multer pour les fichiers téléchargés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Générer un token sécurisé pour la réinitialisation du mot de passe
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Configurer le transporteur pour l'envoi d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Utilisez un autre service si nécessaire
  auth: {
    user: 'colyfaye74@gmail.com',
    pass: 'blinde826@coly'  // Remplacez par un mot de passe spécifique ou par un mot de passe d'application
  }
});


// Envoi du lien de réinitialisation par email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.send('Aucun utilisateur trouvé avec cet email.');
  }

  // Générer un token et enregistrer dans la base de données
  const resetToken = generateResetToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 heure de validité pour le token
  await user.save();

  // Créer le lien de réinitialisation
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  // Envoyer l'email
  const mailOptions = {
    from: 'colyfaye74@gmail.com',
    to: email,
    subject: 'Réinitialisation du mot de passe',
    text: `Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.send('Erreur lors de l\'envoi de l\'email.');
    }

    // Redirection vers la page reset-password avec le token
    res.redirect(`/reset-password`);
  });
});



// Page pour demander la réinitialisation du mot de passe
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');  // Page avec le formulaire d'email
});

// Envoi du lien de réinitialisation par email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.send('Aucun utilisateur trouvé avec cet email.');
  }

  // Générer un token et l'enregistrer dans la base de données
  const resetToken = generateResetToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 heure de validité pour le token
  await user.save();

  // Créer le lien de réinitialisation
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  // Créer les options de l'email
  const mailOptions = {
    from: 'colyfaye74@gmail.com',
    to: email,
    subject: 'Réinitialisation du mot de passe',
    text: `Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`
  };

  // Envoi de l'email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Erreur lors de l\'envoi de l\'email :', err);
      return res.send('Erreur lors de l\'envoi de l\'email.');
    }

    // Redirection vers la page de réinitialisation du mot de passe avec le token
    res.redirect(`/reset-password/${resetToken}`);
  });
});


// Page pour réinitialiser le mot de passe
router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }  // Vérifie si le token est toujours valide
  });

  if (!user) {
    return res.send('Le lien de réinitialisation a expiré ou est invalide.');
  }

  res.render('reset-password', { token });
});

// Traitement de la réinitialisation du mot de passe
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.send('Le lien de réinitialisation a expiré ou est invalide.');
  }

  // Hachage du nouveau mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;  // Réinitialiser le token
  user.resetPasswordExpires = undefined;  // Réinitialiser l'expiration du token
  await user.save();

  res.send('Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.');
});


// Page d'accueil
router.get('/', (req, res) => {
  res.render('home');
});

// Formulaire d'inscription
router.get('/register', (req, res) => {
  res.render('register');
});

// Traitement du formulaire d'inscription
// Traitement du formulaire d'inscription
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { nom, adresse, email, password, terms } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nom,
      adresse,
      email,
      password: hashedPassword,
      image: req.file ? req.file.filename : null,
      termsAccepted: terms === 'on'
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    res.status(500).send("Erreur lors de l'inscription.");
  }
});


// Formulaire de connexion
router.get('/login', (req, res) => {
  res.render('login');
});

// Traitement de la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Identifiants invalides');
  }
});

// Dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;
  res.render('dashboard', { user });
});

// Route de déconnexion
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erreur lors de la déconnexion');
    }
    res.redirect('/login');
  });
});





module.exports = router;
