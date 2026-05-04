const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'raja_properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to protect admin routes
const authAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// PUBLIC ROUTE: Get all properties with strict filtering
router.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice, city, propertyType, search } = req.query;
    let query = {};
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (city) query.city = new RegExp(city, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (search) query.title = new RegExp(search, 'i');

    // VERY IMPORTANT: Strictly select only safe fields.
    // Exclude fullAddress and fullDescription
    const properties = await Property.find(query).select('title price city images teaser propertyType createdAt');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTE: Get all properties with full details
router.get('/admin', authAdmin, async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTE: Create property
router.post('/', authAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { title, price, city, fullAddress, fullDescription, propertyType } = req.body;
    
    // Auto-generate teaser (first 100 chars of full description)
    const teaser = fullDescription.length > 100 ? fullDescription.substring(0, 100) + '...' : fullDescription;

    // Save image paths
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    const property = new Property({
      title, price, city, fullAddress, images: imagePaths, fullDescription, teaser, propertyType
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN ROUTE: Update property
router.put('/:id', authAdmin, upload.array('newImages', 5), async (req, res) => {
  try {
    const updates = req.body;
    if (updates.fullDescription) {
      updates.teaser = updates.fullDescription.length > 100 
        ? updates.fullDescription.substring(0, 100) + '...' 
        : updates.fullDescription;
    }

    // Keep existing images passed from frontend (if any)
    let existingImages = [];
    if (updates.existingImages) {
        existingImages = JSON.parse(updates.existingImages);
    }

    // Add new images
    const newImagePaths = req.files ? req.files.map(file => file.path) : [];
    
    updates.images = [...existingImages, ...newImagePaths];

    const property = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTE: Delete property
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
