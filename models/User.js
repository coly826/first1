const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String, // on stocke seulement le nom du fichier
    required: false
  },
  termsAccepted: { // Nouveau champ ajouté
    type: Boolean,
    required: true,
    default: false // par défaut, l'utilisateur n'a pas accepté les termes
  }
});
module.exports = mongoose.model('User', userSchema);
