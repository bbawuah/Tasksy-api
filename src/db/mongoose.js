const mongoose = require('mongoose');

// connecting a connection with database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: false,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true
});
