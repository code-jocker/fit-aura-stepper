const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const products = await Product.find({}).limit(5);
    console.log(`Found ${products.length} products`);
    
    products.forEach((p, i) => {
      console.log(`\nProduct ${i + 1}: ${p.name}`);
      console.log(`Images:`, p.images.length > 0 ? `${p.images.length} images found` : 'NO IMAGES');
      if (p.images.length > 0) {
        console.log(`First Image (prefix):`, p.images[0].substring(0, 50) + '...');
      }
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProducts();
