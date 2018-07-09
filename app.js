var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user.js");
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/lap");

app.use(expressSession({
  secret: "My name is Ekansh Bansal",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    res.redirect("/login");
  }
}


app.get("/", function(req, res){
  res.render("landing")
})

app.get("/secret", isLoggedIn, function(req, res){
  res.send("Secret");
})

app.get("/register", function(req, res){
  res.render("register");
})

app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log("error at register route");
      return res.render("register");
    } else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secret");
      })
    }
  })
})

app.get("/login", function(req, res){
  res.render("login");
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req,res){
})

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});



app.listen(3000, function(){
  console.log("Server has started on port 3000");
})
