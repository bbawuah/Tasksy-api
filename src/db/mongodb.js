// CRUD Operations
const { MongoClient } = require('mongodb');

const connectionURL = process.env.MONGODB_URL;
const databaseName = 'task-react';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  }

  const db = client.db(databaseName);

  db.collection('tasks').deleteOne({ description: 'bible studies' }).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
});
