const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  // Why does this work thooo lol..
  const authHeader = req.headers['x-access-token']
    || req.headers.Authorization
    || req.headers.authorization
    || req.body.headers.Authorization;

  try {
    // Store JWT token in variable from req.header(Authorization)
    const token = authHeader.replace('Bearer ', ''); // Remove 'Bearer ' with nothing!
    // Verify token with my secret
    // console.log(`Token is ${token}`);

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    // Check User schema and try to find a user
    const user = await User.findOne({
      _id: decoded._id,
      // Find a user with a correct auth token still stored
      'tokens.token': token,
    });

    // If there is no user throw an Error
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    // If authentication fails, send error to authenticate to user
    console.log(e);
    res.status(401).send({ error: 'Please authenticate..' });
  }
};

module.exports = auth;
