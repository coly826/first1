const mongoose = require("mongoose");

const rapportSchema = new mongoose.Schema({
  mois: String,              // Janvier, Février, etc.
  groupe: String,            // A, B, C ou "GLOBAL"
  cartons: Number,
  pieces: Number,
  etiquettes: Number,
  edge: Number,
  surface: Number,
  broken: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Rapport", rapportSchema);
