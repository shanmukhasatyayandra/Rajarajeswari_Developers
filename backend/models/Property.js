const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true }, // Main city, shown on UI
  fullAddress: { type: String, required: true }, // Complete location, hidden
  images: [{ type: String }], // Array of image URLs
  fullDescription: { type: String, required: true }, // Complete description, hidden
  teaser: { type: String, required: true }, // Summarized short description, shown on UI
  propertyType: { type: String, required: true }, // e.g. Plot, House, Apartment
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
