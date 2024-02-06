const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        }
    }
);

const User = model('user', userSchema);

module.exports = User;