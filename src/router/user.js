const express = require('express'); // Requiring the express framework
const sharp = require('sharp');
const User = require('../models/user'); // Requiring the Users model
const auth = require('../middleware/auth');
// Requiring the auth function for the  middleware
const router = new express.Router(); // Creating a new instance of the Express
const multer = require('multer');
const { sendWelcomeEmail, sendGoodbyeEmail, sendMeAnEmail } = require('../emails/account');

// CREATING USERS SIGN UP
router.post('/users', async (req, res) => {
  // Getting the input from the body and adding Mongoose schema type to data
  const user = new User(req.body);
  try {
    // Saving the data in the database
    await user.save();
    // Send success email to user
    sendWelcomeEmail(user.email, user.name);
    sendMeAnEmail(user.name);
    // Generating a token for the user
    const token = await user.generateAuthToken(
      req.body.email,
      req.body.password,
    );
    res.status(201).send({ user, token }); // Send user and token back with the correct http status
  } catch (e) {
    res.status(404).send(e); // If something went wrong send an error back to the user
  }
});

// LOGIN ROUTER
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    ); // finding a user by email with matching password
    console.log(user); // Printing out the user
    const token = await user.generateAuthToken(); // Generating an authentication token for the login session
    res.cookie('jwt', token, { httpOnly: true, domain:process.env.COOKIE_DOMAIN });
    res.send({ user, token }); // Sending back the user with the token
  } catch (e) {
    console.log(e.message); // Consoling the error
    res.status(400).send({ error: e.message }); //  Sending back the error to the user
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token, // Filter out the matching token
    );
    await req.user.save(); // Save the user
    res.send({ msg: 'Logged out!' }); // Sending back the user
  } catch (e) {
    res.status(500).send(e);
  }
});

// ONLY FOR DEV
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// FIND USERS
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    // Send email to client
    sendGoodbyeEmail(req.user.email, req.user.name);
    res.send(req.user);
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

// FIND AND UPDATE USERS
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body); // Given updates
  const allowedUpdates = ['name', 'email', 'password', 'age']; // Array of updates that are allowed
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update)); // Check if update is valid
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' }); // If update is not valid, send an error
  }
  try {
    const { user } = req; // Storing user from middleware
    updates.forEach((update) => (user[update] = req.body[update])); // Bracket notation for dynamic changes)
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/* Store image binary data in req.file.. */
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a jpeg, jpg or png file'));
    }
    // cb(new Error('File must be a PDF'));
    cb(undefined, true);
  },
});

// Post request naar
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

// Get user avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
