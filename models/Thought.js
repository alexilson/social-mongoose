const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            require: true,
            // TODO: Limit 1 to 280 characters
        },
        createdAt: {
            type: Date,
            // TODO: Set default value to the current timestamp
            // TODO: Use a getter method to format the timestamp on query
        },
        username: {
            type: String,
            require: true
        },
        reactions: {
            type: String // TODO: Array of nested documents created with the reactionSchema (not a string)
        }
    }
);

const Thought = model('thought', thoughtSchema);

// creates a test thought so the db is created
Thought.create({
    thoughtText: "I want some food.",
    username: "mrs_potts"
})
.then(result => console.log('Created new thought', result))
.catch(err => console.log("Error!", err));

module.exports = Thought;