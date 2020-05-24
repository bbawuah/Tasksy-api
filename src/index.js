const express = require('express');
require('./db/mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
const port = process.env.PORT || 8000;


// Enable cors

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://http://localhost:8080'); // update to match the domain you will make the request from
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


// app.use(cors({
//   origin: '*',
//   credentials: true,
//   allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
//   methods: 'GET, POST, PATCH, PUT, POST, DELETE, OPTIONS',
// }));

// Cookie parser

const origin = 'http://localhost:8080' || process.env.UI_SERVER_ORIGIN ;

app.use(cors({origin, credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
