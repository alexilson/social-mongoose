const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');


router.get('/', async (req, res) => {
    try {
        thoughts = await Thought.find({})
        res.status(200).json(thoughts)
    } catch(err) {
        res.status(500).send(err)
    }
});

router.get('/:id', async (req, res) => {
    try {
        thoughts = await Thought.findById(
            req.params.id
        )

        if (!thoughts) {
            return res.status(404).send("Thought not found.")
        }

        res.status(200).json(thoughts)
    } catch(err) {
        res.status(500).send(err)
    }
});


router.post('/', async (req, res) => {

    try {
        const thought = await Thought.create(
            req.body
        )
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            {
                $addToSet: {
                    thoughts: thought._id
                }
            },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: "Thought created, user not found." })
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).json(err);
    }
})


router.put('/:postId', async (req, res) => {

    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.postId },
            {
                $set: req.body
            },
            { new: true }
        )

        if (!thought) {
            return res.status(404).json({ message: "Thought not updated." })
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).json(err);
    }
})


router.delete('/:postId', async (req, res) => {

    console.log("Trying to delete: ", req.params.postId)

    try {
        const thought = await Thought.findOneAndDelete(
            { _id: req.params.postId },
        )

        console.log("Tried to delete :( ", thought)

        if (!thought) {
            return res.status(404).json({ message: "Thought not updated." })
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.postId },
            { $pull: { thoughts: req.params.postId }},
            { new: true }
        )

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


router.post('/:thoughtId/reactions', async (req, res) => {

    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body} },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'Something went wrong.' });
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).send(err)
    }
})


router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId} } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'Something went wrong.' });
        }

        res.status(200).json(thought)

    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router