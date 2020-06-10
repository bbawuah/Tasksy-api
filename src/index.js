const express = require('express');
require('./db/mongoose');
const sslRedirect = require('heroku-ssl-redirect');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
const port = process.env.PORT || 8000;

const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8080';

app.use(sslRedirect());
app.use(cors({origin, credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
