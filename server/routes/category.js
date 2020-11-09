const express = require('express');
const _ = require('underscore');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const app = express();

const Category = require('../models/category');

// ===================
// Get All Categories
// ===================
app.get('/category', verifyToken, (req, res) => {
    let { page, limit } = req.query;

    page = Number(page) > 0 ? Number(page) : 1;
    limit = Number(limit) > 0 ? Number(limit) : 5;

    Category.find({})
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('user', 'email name')
        .sort({ description: 1 })
        .exec((error, categories) => {
            if (error) {
                return res.status(500).json({ ok: false, message: 'An error occured while fetching the categories', error: error });
            }

            Category.countDocuments({}, (error, count) => res.status(200).json({ ok: true, count: count, categories: categories }));
        });
});

// ===================
// Get a Category
// ===================
app.get('/category/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    Category.findOne({ _id: id }, (error, categoryDB) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while fetching the category', error: error });
        } else if (categoryDB === undefined || categoryDB === null) {
            return res.status(404).json({ ok: false, message: 'The selected category does not exist', error: { message : 'The selected category does not exist' } });
        }

        res.status(200).json({ ok: true, category: categoryDB });
    })
    .populate('user', 'email name');
});

// ===================
// Create a Category
// ===================
app.post('/category', verifyToken, (req, res) => {
    const { category } = req.body;
    const { user } = req;
  
    if (category === undefined || category === null || category.description === undefined || category.description === null || user === undefined || user === null) {
      return res.status(400).json({ ok: false, message: 'Wrong data' });
    }
    
    const categoryScheme = new Category({ description: category.description, user: user });

    categoryScheme.save((error, categoryDB) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while inserting the category', error: error });
        }

        res.status(201).json({ ok: true, category: categoryDB });
    });
});

// ===================
// Update a Category
// ===================
app.put('/category/:id', verifyToken, (req, res) => {
    const { category } = req.body;
    const { user } = req;
    const { id } = req.params;
  
    if (category === undefined || category === null || category.description === undefined || category.description === null || user === undefined || user === null) {
      return res.status(400).json({ ok: false, message: 'Wrong data' });
    }
    
    Category.findByIdAndUpdate(id, _.pick(category, ['description']), { new: true, runValidators: true, context: 'query', useFindAndModify: false }, (error, categoryDB) => {
        if (error) {
          return res.status(500).json({ ok: false, message: 'An error occured while updating the category', error: error });
        } else if (categoryDB === undefined || categoryDB === null) {
          return res.status(404).json({ ok: false, message: 'An error occured while updating the category', error: { message: 'Category not found' } });
        }

        res.status(200).json({ ok: true, category: categoryDB });
    });
});

// ===================
// Delete a Category
// ===================
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    const { id } = req.params;

    Category.findByIdAndRemove(id, { useFindAndModify: false }, (error, deletedCategory) => {
        if (error) {
            return res.status(500).json({ ok: false, message: 'An error occured while deleting the category', error: error });
        } else if (deletedCategory === undefined || deletedCategory === null) {
            return res.status(404).json({ ok: false, message: 'An error occured while deleting the category', error: { message: 'Category not found' } });
        }

        res.status(200).json({ ok: true, deletedCategory: deletedCategory });
    });
});




module.exports = app;