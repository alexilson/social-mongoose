const router = require('express').Router();
const User = require('../../models/User')

// returns all users
router.get('/', (req, res) => {
    User.find({})
    .then(results => res.json(results))
    .catch(err => console.log("Error!", err))
});

// returns a user based on the id in the parameter
router.get('/:id', (req, res) => {
    User.findOne({
        _id: req.params.id
    })
    .then(results => res.json(results))
    .catch(err => console.log("Error!", err))
});

// create new user, include username and email in body json
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email
    })
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send("Error!", err))
});

module.exports = router;