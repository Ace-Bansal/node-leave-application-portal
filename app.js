var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user.js");
// var Admin = require("./models/admin.js");
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/lap15");

app.use(expressSession({
  secret: "My name is Ekansh Bansal",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// passport.use('local-admin', new LocalStrategy(Admin.authenticate()))
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function isUserLoggedIn(req, res, next){
  console.log(req.user);
  if(req.isAuthenticated() && req.user.isAdmin == "no" && req.user.isStudent == "yes"){
    return next();
  } else{
    res.redirect("/login");
  }
}

function isAdminLoggedIn(req, res, next){
  console.log(req.user);
  if(req.isAuthenticated() && req.user.isAdmin == "yes" && req.user.isStudent == "no"){
    return next();
  } else{
    res.redirect("/adminLogin");
  }
}



app.get("/", function(req, res){
  res.render("landing")
})

//==================================USER ROUTES==========================
app.get("/secret", isUserLoggedIn, function(req, res){
  res.send("Secret");
})

app.get("/register", function(req, res){
  res.render("register");
})

app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log("error at register route");
      console.log(err);
      return res.render("register");
    } else{
      passport.authenticate("local")(req, res, function(){
        console.log(user);
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

//=========================================ADMIN ROUTES===========================
app.get("/adminSecret", isAdminLoggedIn, function(req, res){
  res.send("Admin Secret");
})

app.get("/adminRegister", function(req, res){
  res.render("adminRegister");
})

app.post("/adminRegister", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    user.isStudent = "no";
    user.isAdmin = "yes";
    user.save();
    if(err){
      console.log("error at register route");
      console.log(err);
      return res.render("adminRegister");
    } else{
      passport.authenticate("local")(req, res, function(){
        console.log(user);
        // req.user._id = user._id;
        // req.user.username = user.username;
        res.redirect("/adminSecret");
      })
    }
  })
})

app.get("/adminLogin", function(req, res){
  res.render("adminLogin");
})

app.post("/adminLogin", passport.authenticate("local", {
  successRedirect: "/adminSecret",
  failureRedirect: "/adminLogin"
}), function(req,res){
})

app.get("/adminLogout", function(req, res){
  req.logout();
  res.redirect("/");
});



app.listen(3000, function(){
  console.log("Server has started on port 3000");
})
