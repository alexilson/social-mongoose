const router = require('express').Router();
const Thought = require('../../models/Thought')


router.get('/', async (req, res) => {
    try {
        thoughts = await Thought.find({})
        res.status(200).json(thoughts)
    } catch(err) {
        res.status(500).send(err)
    }
});

module.exports = router