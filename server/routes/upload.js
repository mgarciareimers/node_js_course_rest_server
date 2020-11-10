const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

// Default Options.
app.use(fileUpload());

// ===================
// Upload a file
// ===================
app.post('/upload/:type/:id', (req, res) => {
    const { type, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ ok: false, message: 'No file has been selected', error: { message: 'No file has been selected' }});
    }

    // Validate type.
    const allowedTypes = ['users', 'products'];
    
    if (allowedTypes.indexOf(type) < 0) {
      return res.status(400).json({ ok: false, message: `Type .${ type } is not valid (only "users" or "products")`, error: { message: 'Type is not valid' }});
    }
    
    const file = req.files.file;

    // Validate extension.
    const allowedExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    const filenameSplit = file.name.split('.');
    const extension = filenameSplit[filenameSplit.length - 1];

    if (allowedExtensions.indexOf(extension) < 0) {
      return res.status(400).json({ ok: false, message: `File extension .${ extension } is not valid (only .png, .jpg, .gif or .jpeg)`, error: { message: 'File extension is not valid' }});
    }

    // Update file name.
    const filename = `${ id }-${ new Date().getTime() }.${ extension }`;
  
    // Use the mv() method to place the file somewhere on your server
    file.mv(`./uploads/${ type }/${ filename }`, (error) => {
      if (error) {
        return res.status(500).json({ ok: false, message: 'An error occurred while uploading the file', error: error });
      }

      if (type === 'users') {
        userFile(id, filename, res);
      } else {
        productFile(id, filename, res);
      }
    });
});

// Update user in database.
const userFile = (id, filename, res) => {
  User.findById(id, (error, userDB) => {
    if (error) {
      deleteFile('users', filename);
      return res.status(500).json({ ok: false, message: 'An error occured while uploading the file', error: error });
    } else if (userDB === undefined || userDB === null) {
      deleteFile('users', filename);
      return res.status(404).json({ ok: false, message: 'An error occured while uploading the file', error: { message: 'User not found' } });
    }
    
    // Delete file.
    deleteFile('users', userDB.img);

    userDB.img = filename;

    userDB.save((error, savedUser) => {
      if (error) {
        deleteFile('users', filename);
        return res.status(500).json({ ok: false, message: 'An error occured while uploading the file', error: error });
      }

      return res.status(200).send({ ok: true, message: 'File successfully uploaded', user: savedUser });
    });
  });
}

// Update product in database.
const productFile = (id, filename, res) => {
  Product.findById(id, (error, productDB) => {
    if (error) {
      deleteFile('products', filename);
      return res.status(500).json({ ok: false, message: 'An error occured while uploading the file', error: error });
    } else if (productDB === undefined || productDB === null) {
      deleteFile('products', filename);
      return res.status(404).json({ ok: false, message: 'An error occured while uploading the file', error: { message: 'Product not found' } });
    }
    
    // Delete file.
    deleteFile('products', productDB.img);

    productDB.img = filename;

    productDB.save((error, savedProduct) => {
      if (error) {
        deleteFile('products', filename);
        return res.status(500).json({ ok: false, message: 'An error occured while uploading the file', error: error });
      }

      return res.status(200).send({ ok: true, message: 'File successfully uploaded', user: savedProduct });
    });
  });
}


// Delete a file.
const deleteFile = (type, filename) => {
  const filePath = path.resolve(__dirname, `../../uploads/${ type }/${ filename }`);
    
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = app;