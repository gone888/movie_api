// importing express and morgan
const express = require('express'),
    morgan = require('morgan');

// assigning express to variable 'app'
const app = express();

// using morgan to log requests using morgan's 'common' format
app.use(morgan('common'));

// ensures that static files will be served from the public folder
app.use(express.static('public'));

// default endpoint that returns a message welcoming the user
app.get('/', (req, res) => {
    res.send('Welcome to my movie API!');
});

// movies endpoint that returns the json object 'topMovies' containing a list of 10 top movies
app.get('/movies', (req, res) => {
    const topMovies = [
    { title: 'Titanic', year: '1997' },
    { title: 'The Shawshank Redemption', year: '1994'},
    { title: 'The Godfather', year: '1972'},
    { title: 'The Dark Knight', year: '2008'},
    { title: 'The Godfather Part II', year: '1974'},
    { title: `Schindler's List`, year: '1993'},
    { title: 'Pulp Fiction', year: '1994'},
    { title: 'Forrest Gump', year: '1994'},
    { title: 'The Good, the Bad and the Ugly', year: '1966'},
    { title: 'Inception', year: '2010'}
  ];
  res.json(topMovies);
});

// this is just a test error
app.get('/test-error-sync', (req, res) => {
  throw new Error('This is a synchronous test error!');
});

// error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listening for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});