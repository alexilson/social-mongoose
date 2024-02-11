const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "You should know this! Must include a username.<br>"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "What are you hiding? Must include an email address.<br>"]
        },
        thoughts: {
            type: String // TODO: this should actually be an array of the thoughts model
        },
        friends: {
            type: String // TODO: this should actually be an array of the User model, self reference somehow
        }
        // TODO: Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
    }
);

const User = model('user', userSchema);

module.exports = User;