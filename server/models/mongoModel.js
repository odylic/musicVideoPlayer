const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const URI = process.env.MONGOURI; 

// 'mongodb://localhost/3001/DB';

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'tokens',
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(() => console.log('Error in connection to Mongo DB.'));

var userSchema = new Schema({
  youtube_id: String,
  name: String,
  access_token: String,
  refresh_token: String,
});

module.exports = mongoose.model('User', userSchema);
