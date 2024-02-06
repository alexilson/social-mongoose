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
        }
    }
);

const User = model('user', userSchema);

// creates a user so the db is created
// User.create({
//     name: "Mrs Potts"
// })
// .then(result => console.log('Created new user', result))
// .catch(err => console.log("Error!", err));

module.exports = User;