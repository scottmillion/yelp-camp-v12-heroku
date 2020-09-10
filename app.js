// APP IMPORTS
const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  seedDB = require('./seeds'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require("./models/user");

// ROUTES IMPORTS
const
  commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

// DELETE DATABASE AND LOAD SEED DATA
// seedDB();
app.use(flash());

// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PASS USER INFO TO EVERY VIEW PAGE
app.use((req, res, next) => {
  // whatever you put in res.locals is available on every view template.
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// REQUIRING ROUTES
app.use(indexRoutes);
//refactor: all campground routes start with /campgrounds
app.use("/campgrounds", campgroundRoutes);
//refactor: all comment routes start with /campgrounds/:id/comments
app.use("/campgrounds/:id/comments", commentRoutes);

const dataURL = process.env.DATABASEURL || "mongodb://localhost:27017/yelp-camp-v12"//this is a backup database in case we have some err with DATABASEURL loading. 

// MONGOOSE MONGO CONFIG
mongoose.connect(dataURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

// =====================
// SERVER
// =====================

app.listen(process.env.PORT || 3000, process.env.IP, (req, res) => {
  console.log("live, sir!")
});