const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
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

// creates a user so the db is created
User.create({
    username: "mrs_potts",
    email: "test@test.test"
})
.then(result => console.log('Created new user', result))
.catch(err => console.log("Error!", err));

module.exports = User;