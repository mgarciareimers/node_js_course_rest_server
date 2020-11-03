const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role',
};

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, 'The user name is required'] },
    email: { type: String, required: [true, 'The email is required'], unique: true },
    password: { type: String, required: [true, 'The password is required'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: validRoles },
    state: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
});

userSchema.plugin(uniqueValidator, { message: '{PATH} needs to be unique' });

module.exports = mongoose.model('User', userSchema);