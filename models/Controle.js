const mongoose = require("mongoose");

const controleSchema = new mongoose.Schema({
  date: String,
  mois: String,
  groupe: String,
  cartons: Number,
  pieces: Number,
  etiquettes: Number,
  edge: Number,
  surface: Number,
  broken: Number,
  user: String
});

module.exports = mongoose.model("Controle", controleSchema);
