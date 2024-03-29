const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server for project running on port ${PORT}`);
    });
});

// added to test db, remove later
// const Thought = require('./models/Thought');
// const huh = new Thought;
// console.log(Date.now().toString())
