const { Schema, model } = require('mongoose');
const Thought = require('./Thought');


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
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'student'
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
        }
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;