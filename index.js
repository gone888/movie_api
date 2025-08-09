// importing modules
const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

// assigning express to variable 'app'
const app = express();

// middleware
app.use(bodyParser.json());

// using morgan to log requests using morgan's 'common' format
app.use(morgan('common'));

// example users array
let users = [
    {
        id: 1,
        name: 'Kim',
        favoriteMovies: ["The Dark Knight"],
    },
    {
        id: 2,
        name: 'Mark',
        favoriteMovies: [],
    },
];

// movies array
let movies = [
    {   "Title":"The Shawshank Redemption",
        "Description":"A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
        "Genre": {
            "Name":"Drama",
            "Description": "In film, drama typically refers to a serious, emotional, and often character-driven narrative, focusing on compelling conflicts and emotional experiences, rather than comedic or lighthearted stories."  
        },
        "Director": {
            "Name":"Frank Darabont",
            "Description": "Frank Árpád Darabont (born Ferenc Árpád Darabont, January 28, 1959)[2] is an American screenwriter, director, and producer of Hungarian origin. He has been nominated for three Academy Awards and a Golden Globe Award. In his early career, he was primarily a screenwriter for such horror films as A Nightmare on Elm Street 3: Dream Warriors (1987), The Blob (1988), and The Fly II (1989). As a director, he is known for his film adaptations of Stephen King novellas and novels, such as The Shawshank Redemption (1994), The Green Mile (1999), and The Mist (2007).",
            "Birth":1959.0
        },
        "ImageURL": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRhGnXtIxFhLVDu_Y9e4WV8J10B0Itb-DHdSGZINXmi0Zt1gWfmBKhJ3dJm04_vHdASVK2-Uw",
        "Featured": true
    },
    {   "Title":"The Dark Knight",
        "Description":"When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.",
        "Genre": {
            "Name":"Action",
            "Description": "In the context of film, 'Action' is a genre characterized by fast-paced, dynamic sequences of fights, chases, and explosions, often with a clear objective and time constraint."  
        },
        "Director": {
            "Name":"Christopher Nolan",
            "Description": "Sir Christopher Edward Nolan (born 30 July 1970) is a British and American filmmaker. Known for his Hollywood blockbusters with structurally complex storytelling, he is considered a leading filmmaker of the 21st century. Nolan's films have earned over $6.6 billion worldwide, making him the seventh-highest-grossing film director. His accolades include two Academy Awards, a Golden Globe Award and two British Academy Film Awards. Nolan was appointed a Commander of the Order of the British Empire in 2019, and received a knighthood in 2024 for his contributions to film.",
            "Birth":1970.0
        },
        "ImageURL":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRxsc3y8f6axKrxHKlFnRaVaByZd9GxgIxdvmurQxJtrby1y05lW1SG0mOnNpwTq90m_pAIjw",
        "Featured": true
    },
    {   "Title":"Inception",
        "Description":"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
        "Genre": {
            "Name":"Sci-Fi",
            "Description": "Science fiction (sci-fi) film is a genre that explores futuristic or fantastical themes based on scientific or technological advancements, often involving elements like space exploration, alien life, time travel, or advanced technologies."  
        },
        "Director": {
            "Name":"Christopher Nolan",
            "Description": "Sir Christopher Edward Nolan (born 30 July 1970) is a British and American filmmaker. Known for his Hollywood blockbusters with structurally complex storytelling, he is considered a leading filmmaker of the 21st century. Nolan's films have earned over $6.6 billion worldwide, making him the seventh-highest-grossing film director. His accolades include two Academy Awards, a Golden Globe Award and two British Academy Film Awards. Nolan was appointed a Commander of the Order of the British Empire in 2019, and received a knighthood in 2024 for his contributions to film.",
            "Birth":1970.0
        },
        "ImageURL":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC0J0IKeAxdnCKSdAUNTmHmuwdQGrLCcdXHM3TqrXK_jjhFSw0WiYa8dpb4YXufJ4dYTtbQw",
        "Featured": true}
];

// allow new users to register
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }
    else {
        res.status(400).send('users need names')
    }
});

// allow users to update their username
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user){
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }

});

// allow users to add a movie to their list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user){
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }

});

// allow users to remove a movie from their list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user){
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }

});

// allow existing users to deregister
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user){
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${user.id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }

});

// movies endpoint that returns the json object 'movies'
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// return data (description, genre, director, image URL, whether its featured or not), by title to the user
app.get('/movies/:title', (req, res) =>{
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie){
        res.status(200).json(movie);
    }
    else {
        res.status(400).send('no such movie');
    }
});

// return data about a genre (description) by name/title
app.get('/movies/genre/:genreName', (req, res) =>{
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre){
        res.status(200).json(genre);
    }
    else {
        res.status(400).send('no such genre');
    }
});

// return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:directorName', (req, res) =>{
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director){
        res.status(200).json(director);
    }
    else {
        res.status(400).send('no such director');
    }
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