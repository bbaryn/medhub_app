const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/medhub', {
  useNewUrlParser: true
});

const db = mongoose.connection;

const DataSchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
    trim: true,
    minlength: 9,
    unique: true,
  },
  pesel: {
    type: Number,
    required: true,
    trim: true,
    minlength: 11,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  },
  postalcode: {
    type: Number,
    require: true,
    minlength: 6
  },
  city: {
    type: String,
    require: true,
    minlength: 6
  }
});

const Data = module.exports = mongoose.model('Data', DataSchema);
