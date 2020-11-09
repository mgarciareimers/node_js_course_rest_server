const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: { type: String, unique: true, required: [true, 'The description is required'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] },
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} needs to be unique' });

module.exports = mongoose.model('Category', categorySchema);