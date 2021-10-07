const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('Enter');
    res.send('Hi, World');
});

app.listen(port, () => {console.log('server is running'); });