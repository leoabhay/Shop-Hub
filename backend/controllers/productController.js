const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Get all products with filtering, pagination, and sorting
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, brand, featured } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one product image' });
    }

    const images = req.files.map(file => {
      const filePath = path.join(__dirname, '..', 'uploads', 'products', file.filename);
      const bitmap = fs.readFileSync(filePath);
      const extension = path.extname(file.filename).slice(1);
      const base64 = `data:image/${extension};base64,${bitmap.toString('base64')}`;
      
      // Cleanup: delete the file from disk after conversion to base64
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return base64;
    });

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      brand,
      featured: featured === 'true',
      images,
      seller: req.user.id
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, discountPrice, category, stock, brand, featured } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (brand) product.brand = brand;
    if (featured !== undefined) product.featured = featured === 'true';

    if (req.files && req.files.length > 0) {
      // If we are still storing locally, we would delete them. 
      // Since we are moving to base64, the old ones (if they were paths) should be handled.
      product.images = req.files.map(file => {
        const filePath = path.join(__dirname, '..', 'uploads', 'products', file.filename);
        const bitmap = fs.readFileSync(filePath);
        const extension = path.extname(file.filename).slice(1);
        const base64 = `data:image/${extension};base64,${bitmap.toString('base64')}`;
        
        // Cleanup
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        return base64;
      });
    }

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If images were paths, delete them. If they are base64, nothing to delete on disk.
    product.images.forEach(img => {
      if (!img.startsWith('data:')) {
        const imgPath = path.join(__dirname, '..', img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
    });

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.calculateRatings();
    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};