const { Schema, Types, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: formatTimestamp
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

function formatTimestamp(timestamp) {
    return `${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`
}

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thought = model('thought', thoughtSchema); 

// const reactionData = [
//     { reactionBody: 'Cats', username: "test" },
//     { reactionBody: 'Hello lurk more', username: "jesus" },
//   ];

// // creates a test thought so the db is created
// Thought.create({
//     thoughtText: "I want some food.",
//     username: "test",
//     reactions: reactionData
// })
// .then(result => console.log('Created new thought', result))
// .catch(err => console.log("Error!", err));

module.exports = Thought;
