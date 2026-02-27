/**
 * Script to fix products with empty SKUs in the database
 * Run with: node fix-empty-skus.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

async function fixEmptySkus() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/mbabazi_closet_db';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all products with empty or null SKU
    const productsWithEmptySku = await Product.find({
      $or: [
        { sku: '' },
        { sku: null },
        { sku: { $exists: false } }
      ]
    });

    console.log(`Found ${productsWithEmptySku.length} products with empty/null SKUs`);

    let updatedCount = 0;

    for (const product of productsWithEmptySku) {
      // Generate unique SKU
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      const newSku = `SKU-${timestamp}-${random}`.toUpperCase();
      
      product.sku = newSku;
      await product.save();
      
      console.log(`Updated product "${product.name}" with SKU: ${newSku}`);
      updatedCount++;
    }

    console.log(`\nSuccessfully fixed ${updatedCount} products`);
    
    // Also fix products with duplicate SKUs (keep the first one, regenerate others)
    const duplicateSkus = await Product.aggregate([
      { $match: { sku: { $ne: null, $ne: '' } } },
      { $group: { _id: '$sku', count: { $sum: 1 }, products: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    console.log(`\nFound ${duplicateSkus.length} duplicate SKU values`);

    for (const dup of duplicateSkus) {
      // Keep the first product's SKU, regenerate for others
      const productsToFix = dup.products.slice(1);
      
      for (const productId of productsToFix) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const newSku = `SKU-${timestamp}-${random}`.toUpperCase();
        
        await Product.findByIdAndUpdate(productId, { sku: newSku });
        console.log(`Fixed duplicate SKU for product ${productId} with new SKU: ${newSku}`);
      }
    }

    console.log('\nDone!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixEmptySkus();
