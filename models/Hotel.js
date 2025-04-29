const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  email: String,
  price: Number,
  address: String,
  phone: String,
  currency: String,
  image: String
});

module.exports = mongoose.model('Hotel', hotelSchema);
