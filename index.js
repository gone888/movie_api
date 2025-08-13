// importing modules
const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

app.use(bodyParser.json());

// allows access to documentation.html
app.use(express.static('public'))

// default endpoint
app.get('/', (req, res) => {
    res.send("Welcome to my movie API!");
})

// importing passport
const passport = require('passport');
require('./passport');

// importing auth.js
let auth = require('./auth')(app);

// connecting to database
mongoose.connect('mongodb://localhost:27017/cfDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

// logging to console using morgan middleware
app.use(morgan('common'));

// GET data about all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error),
            res.status(500).send('Error: ' + error);
        })
});

// GET data about all users
app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((error) => {
            console.error(error),
            res.status(500).send('Error: ' + error);
        })
});

// GET data about a single movie by its title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.find( {Title: req.params.Title} )
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((error) => {
            console.error(error),
            res.status(500).send('Error: ' + error);
        })
});

// GET data about a genre by its name
app.get('/genre/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.findOne( {'Genre.Name': req.params.genreName} )
        .then((genre) => {
            res.json(genre.Genre);
        })
        .catch((error) => {
            console.error(error),
            res.status(500).send('Error: ' + error);
        })
});

// GET data about a director by their name
app.get('/director/:directorsName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.findOne( {'Director.Name': req.params.directorsName} )
        .then((director) => {
            res.json(director.Director);
        })
        .catch((error) => {
            console.error(error),
            res.status(500).send('Error: ' + error);
        })
});

// CREATE a new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
                .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// CREATE, add a movie to the users FavoriteMovies list 
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {
        $push: { FavoriteMovies: req.params.movieID }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// UPDATE a users information
app.put('/users/:username', passport.authenticate('jwt', { session: false }),async (req, res) => {
    if(req.user.Username !== req.params.username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.username }, { 
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,    
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

// DELETE a movie from a users FavoriteMovies list 
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {
        $pull: { FavoriteMovies: req.params.movieID }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }); 
})

// DELETE a user by their username
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.username + ' was not found');
        } else {
            res.status(200).send(req.params.username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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