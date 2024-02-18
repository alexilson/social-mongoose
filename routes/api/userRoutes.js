const router = require('express').Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');


// gets all users
router.get('/', (req, res) => {
    try {
        User.find({})
        .then(results => res.status(200).json(results))
    } catch(err) {
        res.status(500).send(err)
    }
});


// returns a user based on the id in the parameter, populates with thoughts and friends
router.get('/:id', async (req, res) => {
    try {
        await User.findOne({
            _id: req.params.id
        }).populate(['thoughts', 'friends'])
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
        req.body,
        {new: true}
    )
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
})


// delete a user
router.delete('/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(
            req.params.id
        )
        
        // early return if user wasn't found
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // deletes the user's thoughts
        await Thought.deleteMany({ _id: { $in: user.thoughts }})
        
        // send back ok status and show user that was deleted
        res.status(200).send(user)

    } catch (err) {
        res.status(500).json(err);
    }
})


// add user to friends list
router.post('/:userId/friends/:friendId', async (req, res) => {

    try {

        // find user from userId parameter
        const friends = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId }},  // add friend userId to friends set
            { new: true } // return new record
        )

        // return early if nothing returned from query
        if (!friends) {
            return res.status(404).json({ message: 'Friends not found.' });
        }

        // return new friend count
        res.status(200).json({ message:'Friend added! Friend count: ' + friends.friends.length});

        } catch (err) {
            res.status(500).json(err);
        }
})

// delete user from friends list
router.delete('/:userId/friends/:friendId', async (req, res) => {

    try {

        // takes the friend's userId out of the user's friends array
        const friends = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true }
        )

        // early return if nothing is returned from query
        if (!friends) {
            return res.status(404).json({ message: 'Friends not found.' });
        }

        // returns new friends count
        res.status(200).json({ message:'Friend deleted!! Friend count: ' + friends.friends.length });

        } catch (err) {
            res.status(500).json(err);
        }
})

module.exports = router;