const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // The local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    // This is the username you’re encoding in the JWT
    subject: user.Username,
    // This specifies that the token will expire in 7 days
    expiresIn: "7d",
    // This is the algorithm used to “sign” or encode the values of the JWT
    algorithm: "HS256",
  });
};

/**
 * @description Login a user
 * @name POST /login
 * @example
 * Query Parameters
 * None
 * @example
 * Authentication: None
 * @example
 * Request body data format
  {
  "Username": "test123",
  "Password": "test123"
  }
 * @example
 * Response body data format
 * A JSON object holding the users information. Example:
 * 
 * {
 * user:
{
  "Username": "test123",
  "Password": "as98jwafklsd",
  "Email": "test123@gmail.com",
  "Birthday": "2000-01-01T00:00:00.000Z",
  "FavoriteMovies": [],
  "_id": "689bfb275ac5bff32267fce2",
  "__v": 0
  },
  token: "exampletoken"
  }
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    // 'local' = LocalStrategy from passport.js
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
