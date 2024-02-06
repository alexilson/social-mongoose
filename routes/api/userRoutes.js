const router = require('express').Router();
const User = require('../../models/User')

// returns all users
router.get('/', (req, res) => {
    User.find({})
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err))
});


// returns a user based on the id in the parameter
router.get('/:id', (req, res) => {
    User.findOne({
        _id: req.params.id
    })
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err))
});


// create new user, include username and email in body json
router.post('/', (req, res) => {
    // .init() will force it to wait until the index is done building so it can check for uniqueness
    User.init().then(() => User
    .create({
        username: req.body.username,
        email: req.body.email
    }))
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
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
        return res.status(500).send("Unable to update username.");
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

module.exports = router;