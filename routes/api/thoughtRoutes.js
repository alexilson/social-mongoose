const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');


// returns all thoughts
router.get('/', async (req, res) => {
    try {
        thoughts = await Thought.find({})
        res.status(200).json(thoughts)
    } catch(err) {
        res.status(500).send(err)
    }
});

// returns a thought based on the id provided in the parameter
router.get('/:id', async (req, res) => {
    try {
        thoughts = await Thought.findById(
            req.params.id
        )

        // if nothing is returned
        if (!thoughts) {
            return res.status(404).send("Thought not found.")
        }

        res.status(200).json(thoughts)
    } catch(err) {
        res.status(500).send(err)
    }
});


// adds a new thought
router.post('/', async (req, res) => {

    try {

        // create the thought document
        const thought = await Thought.create(
            req.body  // body requires userId, username, and thoughtText
        )

        // add thoughtId to the user's thoughts array
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            {
                $addToSet: {
                    thoughts: thought._id
                }
            },
            { new: true }  // return the new record
        )

        // if user is not found, early return
        if (!user) {
            return res.status(404).json({ message: "Thought created, user not found." })
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).json(err);
    }
})


// update a thought based on its id
router.put('/:postId', async (req, res) => {

    try {

        // find the thought based on the id provided
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.postId },
            {
                $set: req.body  // set to body, must include thoughtText, username, userId
            },
            { new: true }
        )

        // early return if no response
        if (!thought) {
            return res.status(404).json({ message: "Thought not updated." })
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).json(err);
    }
})


// delete post by Id provided
router.delete('/:postId', async (req, res) => {

    try {

        // delete thought based on the id provided in parameter
        const thought = await Thought.findOneAndDelete(
            { _id: req.params.postId },
        )

        // if thought not found, early return
        if (!thought) {
            return res.status(404).json({ message: "Thought not updated." })
        }

        // remove thoughtId from the user's thoughts array
        const user = await User.findOneAndUpdate(
            { thoughts: req.params.postId },
            { $pull: { thoughts: req.params.postId }},
            { new: true }
        )

        // early return if user is not found
        if (!user) {
            return res.status(404).json({
              message: 'Thought deleted but no user with this id!',
            });
          }

        res.status(200).json(thought)

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})


// add a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {

    try {

        // add the reaction to the thought's reactions subdocument
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body} }, // body must include reactionBody and username
            { runValidators: true, new: true }
        );

        // early return if thought not found
        if (!thought) {
            return res.status(404).json({ message: 'Something went wrong.' });
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).send(err)
    }
})


// delete a reaction based on thoughtid and reactionid provided in parameters
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {

        // remove the reaction based on reactionId from the thought's reaction array based on thoughtId parameter
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId} } },
            { runValidators: true, new: true }
        );

        // early return if thought not found
        if (!thought) {
            return res.status(404).json({ message: 'Something went wrong.' });
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router