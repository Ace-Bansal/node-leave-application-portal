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
mongoose.connect("mongodb://localhost/lap30");

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
  var newApplication = req.body.application;
  User.findById(req.user._id, function(err, user){
    if(err){
      console.log(err);
      console.log("error on the submit application route");
    } else{
      Application.create(newApplication, function(err, createdApp){
        if(err){
          console.log(err);
          console.log("error on the create app route");
        } else{
          console.log(createdApp);
          console.log(user.applications);
          createdApp.submitter.id = req.user._id;
          createdApp.submitter.name = user.username;
          createdApp.save();
          user.applications.push(createdApp);

          user.reasonForLeave = newApplication.reasonForLeave;
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
  User.register(new User({username: req.body.username, rollNo: req.body.rollNo}), req.body.password, function(err, user){
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

app.post("/rejectApplication/:appId", function(req, res){
  Application.findById(req.params.appId, function(err, application){
    if(err){
      console.log(err);
      console.log("error on the reject application route");
    } else{
      application.isAccepted = "no";
      application.save();
      res.redirect("/adminHome")
    }
  })
})

app.post("/acceptApplication/:appId", function(req, res){
  Application.findById(req.params.appId, function(err, application){
    if(err){
      console.log(err);
      console.log("error on the reject application route");
    } else{
      application.isAccepted = "yes";
      application.save();
      res.redirect("/adminHome")
    }
  })
})

app.get("/application/:appId", function(req, res){
  Application.findById(req.params.appId, function(err, application){
    if(err){
      console.log(err);
      console.log("error on the show application route");
    } else{
      res.render("applicationShow", {application: application})
    }
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
