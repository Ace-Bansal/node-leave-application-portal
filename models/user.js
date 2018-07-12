var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  rollNo: String,
  reasonForLeave: String,
  isStudent: {
    type: String,
    default: "yes"
  },
  isAdmin: {
    type: String,
    default: "no"
  }
})

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema);
