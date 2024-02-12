const { Schema, model } = require('mongoose');

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
            // TODO: Use a getter method to format the timestamp on query
            get: formatTimestamp
        },
        username: {
            type: String,
            required: true
        },
        reactions: {
            type: String // TODO: Array of nested documents created with the reactionSchema (not a string)
        }
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

// thoughtSchema.virtual('timestamp').get(function () {
//     return `${this.createdAt.toString()}`;
// })

const Thought = model('thought', thoughtSchema);

// creates a test thought so the db is created
Thought.create({
    thoughtText: "I want some food.",
    username: "mrs_potts"
})
.then(result => console.log('Created new thought', result))
.catch(err => console.log("Error!", err));

// whatever();

module.exports = Thought;