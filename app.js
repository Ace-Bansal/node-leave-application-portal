var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user.js");
var Application = require("./models/application.js");
// var Admin = require("./models/admin.js");
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/lap27");

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
  // console.log(req.user);
  if(req.isAuthenticated() && req.user.isAdmin == "no" && req.user.isStudent == "yes"){
    return next();
  } else{
    res.redirect("/login");
  }
}

function isAdminLoggedIn(req, res, next){
  // console.log(req.user);
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
app.get("/studentHome", isUserLoggedIn, function(req, res){
  res.render("studentHome");
})

app.post("/studentHome", function(req, res){
  User.findById(req.user._id, function(err, user){
    if(err){
      console.log(err);
      console.log("error on the submit application route");
    } else{
      var application = {
        submitter: {
          id: req.user._id,
          name: req.body.student.name
        },
        reasonForLeave: req.body.student.reasonForLeave
      }
      Application.create(application, function(err, createdApp){
        if(err){
          console.log(err);
          console.log("error on the create app route");
        } else{
          console.log(createdApp);
          console.log(user.applications);
          user.applications.push(createdApp);

          user.name = req.body.student.name;
          user.rollNo = req.body.student.rollNo;
          user.reasonForLeave = req.body.student.reasonForLeave;
          user.save();
          // console.log(user.applications);

          res.redirect("/applicationStatus");
        }
      })
    }
  })
})

app.get("/applicationStatus", function(req, res){
  User.findById(req.user._id).populate("applications").exec(function(err, user){
    res.render("applicationStatus", {user: user})
  })
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
        // console.log(user);
        res.redirect("/studentHome");
      })
    }
  })
})

app.get("/login", function(req, res){
  res.render("login");
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/studentHome",
  failureRedirect: "/login"
}), function(req,res){
})

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

//=========================================ADMIN ROUTES=========================
app.get("/adminHome", isAdminLoggedIn, function(req, res){
  Application.find({}, function(err, applications){
    res.render("adminHome", {applications: applications});
  })
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
        // console.log(user);
        // req.user._id = user._id;
        // req.user.username = user.username;
        res.redirect("/adminHome");
      })
    }
  })
})

app.get("/adminLogin", function(req, res){
  res.render("adminLogin");
})

app.post("/adminLogin", passport.authenticate("local", {
  successRedirect: "/adminHome",
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
