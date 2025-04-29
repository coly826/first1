const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Hotel = require('../models/Hotel');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // dossier de destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nom unique
  }
});
const upload = multer({ storage });

// 👉 Route pour afficher la liste des hôtels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.render('index', { hotels }); // passe les hôtels à la vue
  } catch (error) {
    console.error('Erreur lors de la récupération des hôtels :', error);
    res.status(500).send('Erreur serveur');
  }
});

// 👉 Route pour ajouter un nouvel hôtel
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, price, address, phone, currency } = req.body;
    const image = req.file ? req.file.filename : null;

    const newHotel = new Hotel({
      name,
      email,
      price,
      address,
      phone,
      currency,
      image
    });

    await newHotel.save();
    res.redirect('/hotels');
  } catch (error) {
    console.error('Erreur lors de l’ajout de l’hôtel :', error);
    res.status(500).send('Erreur serveur');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.redirect('/hotels');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});


router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, email, price, address, phone, currency } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateData = { name, email, price, address, phone, currency };
    if (image) updateData.image = image;

    await Hotel.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/hotels');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});


router.get('/edit/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.render('edit', { hotel });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;
  const notification = req.session.notification || null;

  // Une fois récupérée, on efface la notification de la session
  req.session.notification = null;

  res.render('dashboard', { user, notification });
});



module.exports = router;
