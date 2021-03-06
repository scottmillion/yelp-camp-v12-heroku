const mongoose = require('mongoose');

// MONGOOSE SCHEMA AND MODEL
const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      username: String
    },
    username: String
  },
  // ASSOCIATING ONE CAMPGROUND TO MANY COMMENTS BY REFERENCING DATA METHOD
  // THIS STORES AN OBJECT ID OF THE COMMENT IN AN ARRAY
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]

});
module.exports = mongoose.model('Campground', campgroundSchema);