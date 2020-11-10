const express = require('express');
const _ = require('underscore');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const app = express();

const Product = require('../models/product');

// ===================
// Get All Products
// ===================
app.get('/product', verifyToken, (req, res) => {
    let { page, limit } = req.query;

    page = Number(page) > 0 ? Number(page) : 1;
    limit = Number(limit) > 0 ? Number(limit) : 5;

    Product.find({})
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('user', 'email name')
        .populate('category', 'description')
        .sort({ description: 1 })
        .exec((error, products) => {
            if (error) {
                return res.status(500).json({ ok: false, message: 'An error occured while fetching the products', error: error });
            }

            Product.countDocuments({}, (error, count) => res.status(200).json({ ok: true, count: count, products: products }));
        });
});

// ===================
// Get a Product
// ===================
app.get('/product/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    Product.findOne({ _id: id }, (error, productDB) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while fetching the product', error: error });
        } else if (productDB === undefined || productDB === null) {
            return res.status(404).json({ ok: false, message: 'The selected product does not exist', error: { message : 'The selected product does not exist' } });
        }

        res.status(200).json({ ok: true, product: productDB });
    })
    .populate('user', 'email name')
    .populate('category', 'description');
});

// ===================
// Filter Products
// ===================
app.get('/product/filter/:filterText', verifyToken, (req, res) => {
    let { page, limit } = req.query;
    const { filterText } = req.params;

    page = Number(page) > 0 ? Number(page) : 1;
    limit = Number(limit) > 0 ? Number(limit) : 5;

    const regex = new RegExp(filterText, 'i');

    Product.find({ name: regex })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('user', 'email name')
        .populate('category', 'description')
        .sort({ description: 1 })
        .exec((error, products) => {
            if (error) {
                return res.status(500).json({ ok: false, message: 'An error occured while fetching the products', error: error });
            }

            Product.countDocuments({ name: regex }, (error, count) => res.status(200).json({ ok: true, count: count, products: products }));
        });
});

// ===================
// Create a Product
// ===================
app.post('/product', verifyToken, (req, res) => {
    const { product } = req.body;
    const { user } = req;
  
    if (product === undefined || product === null || product.category === undefined || product.category === null || user === undefined || user === null) {
      return res.status(400).json({ ok: false, message: 'Wrong data' });
    }
    
    const productScheme = new Product({ name: product.name, unitPrice: product.unitPrice, description: product.description, img: product.img, available: product.available, category: product.category, user: user });

    productScheme.save((error, productDB) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while inserting the product', error: error });
        }

        res.status(201).json({ ok: true, product: productDB });
    });
});

// ===================
// Update a Product
// ===================
app.put('/product/:id', verifyToken, (req, res) => {
    const { product } = req.body;
    const { user } = req;
    const { id } = req.params;
  
    if (product === undefined || product === null) {
      return res.status(400).json({ ok: false, message: 'Wrong data' });
    }

    Product.findByIdAndUpdate(id, _.pick(product, ['name', 'unitPrice', 'description', 'img', 'available', 'category']), { new: true, runValidators: true, context: 'query', useFindAndModify: false }, (error, productDB) => {
        if (error) {
          return res.status(500).json({ ok: false, message: 'An error occured while updating the product', error: error });
        } else if (productDB === undefined || productDB === null) {
          return res.status(404).json({ ok: false, message: 'An error occured while updating the product', error: { message: 'Product not found' } });
        }

        res.status(200).json({ ok: true, product: productDB });
    });
});

// ===================
// Delete a Product (logic)
// ===================
app.put('/product/:id/delete', verifyToken, (req, res) => {
    const { id } = req.params;
  
    Product.findByIdAndUpdate(id, _.pick({ available: false }, ['available']), { new: true, context: 'query', useFindAndModify: false }, (error, productDB) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while deleting the product', error: error });
        } else if (productDB === undefined || productDB === null) {
            return res.status(404).json({ ok: false, message: 'An error occured while deleting the product', error: { message: 'Product not found' } });
        }
  
        res.status(200).json({ ok: true, product: productDB });
    });
  });

// ===================
// Delete a Product
// ===================
app.delete('/product/:id', [verifyToken, verifyAdminRole], (req, res) => {
    const { id } = req.params;

    Product.findByIdAndRemove(id, { useFindAndModify: false }, (error, deletedProduct) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while deleting the product', error: error });
        } else if (deletedProduct === undefined || deletedProduct === null) {
            return res.status(404).json({ ok: false, message: 'An error occured while deleting the product', error: { message: 'Product not found' } });
        }

        res.status(200).json({ ok: true, deletedProduct: deletedProduct });
    });
});




module.exports = app;