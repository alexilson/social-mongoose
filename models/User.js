const { Schema, model } = require('mongoose');
const Thought = require('./Thought');


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "You should know this! Must include a username.<br>"], // custom error message
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "What are you hiding? Must include an email address.<br>"] // custom error message
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

// returns a count of the friends
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;