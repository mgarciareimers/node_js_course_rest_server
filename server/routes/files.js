const express = require('express');
const fs = require('fs');
const path = require('path');

const { verifyTokenFile } = require('../middlewares/authentication');

const app = express();

app.get('/file/:type/:file', verifyTokenFile, (req, res) => {
    const { type, file } = req.params;

    const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
    const filePath = path.resolve(__dirname, `../../uploads/${ type }/${ file }`);

    res.sendFile(fs.existsSync(filePath) ? filePath : noImagePath); 
});


module.exports = app;