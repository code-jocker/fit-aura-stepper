const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: String,
    image: String,
    subcategories: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        slug: {
          type: String,
          lowercase: true
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
  
  // Ensure subcategories also have slugs
  if (this.subcategories && this.subcategories.length > 0) {
    this.subcategories.forEach(sub => {
      if (!sub.slug && sub.name) {
        sub.slug = sub.name.toLowerCase().split(' ').join('-');
      }
    });
  }
  
  next();
});

module.exports = mongoose.model('Category', categorySchema);
