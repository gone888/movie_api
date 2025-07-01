const express = require('express'),
      morgan = require('morgan'),
      path = require('path');

const app = express();

// Middleware library to log all requests
app.use(morgan('common'));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// GET route for 'movies'
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
    res.json({movies: topMovies});
})

// GET route for '/'
app.get('/', (req, res) => {
  res.send('This is my movie API!');
});

// Error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server on port 8080 
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});