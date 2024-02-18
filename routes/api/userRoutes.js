const router = require('express').Router();
const User = require('../../models/User')


router.get('/', (req, res) => {
    try {
        User.find({})
        .then(results => res.status(200).json(results))
    } catch(err) {
        res.status(500).send(err)
    }
});


// returns a user based on the id in the parameter
router.get('/:id', async (req, res) => {
    try {
        await User.findOne({
            _id: req.params.id
        })
        .then(results => res.status(200).json(results))
    } catch(err) {
        res.status(500).send(err)
    }
});


// create new user, include username and email in body json
router.post('/', (req, res) => {

    if (!req.body) {
        return res.status(500).send("No body sent with request.")
    }

    // .init() will force it to wait until the index is done building so it can check for uniqueness
    User.init().then(() => User
    .create({
        username: req.body.username,
        email: req.body.email
    }))
    .then(result => res.status(200).send(result))
    .catch(function (err) {
        // Custom error handling for unique constraint
        if (err.code === 11000 && err.keyPattern.username === 1) {
            return res.status(500).send("Duplicate username.")
        }

        // Formats multiple error messages to only return the actual error messages and not reveal anything about the schema.
        let messages = ''
        err.message.split(',').forEach((errorMsg) => messages = messages + errorMsg.split(': ').at(-1))
        res.status(500).send(messages)
    })
});


// updates a user. does not allow username to be updated.
router.put('/:id', (req, res) => {

    // check if a body was included in the request
    if (!req.body) {
        return res.status(500).send("No body sent with request.")
    }

    // check if the requested update is for the username.
    // Username cannot be updated if we are using it to identify who posted a thought/reaction.
    if (req.body.username) {
        return res.status(500).send("Username is not able to be updated.");
    }

    // find by the id and update whatever fields were included in the body of the request (basically only email is valid to update)
    User.findByIdAndUpdate(
        req.params.id,
        req.body
    )
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
})


// delete a user
router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(
        req.params.id
    )
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
})


router.post('/:userId/friends/:friendId', async (req, res) => {

    try {
        const friends = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
        )

        if (!friends) {
            return res.status(404).json({ message: 'Friends not found.' });
        }

        res.status(200).json({ message:'Friend added! Friend count: ' + friends.friends.length});

        } catch (err) {
            res.status(500).json(err);
        }
})

router.delete('/:userId/friends/:friendId', async (req, res) => {

    try {
        const friends = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true }
        )

        if (!friends) {
            return res.status(404).json({ message: 'Friends not found.' });
        }

        res.status(200).json({ message:'Friend deleted!! Friend count: ' + friends.friends.length });

        } catch (err) {
            res.status(500).json(err);
        }
})

module.exports = router;