const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: String,
  adresse: String,
  email: { type: String, unique: true },
  password: String,
  image: String // nom du fichier upload
});

module.exports = mongoose.model("User", userSchema);
