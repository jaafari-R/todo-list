const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 14783;

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res, next) => {
    res.render('index');
});


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});