var mongoose = require("mongoose");

var applicationSchema = new mongoose.Schema({
  submitter: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  reasonForLeave: String
})

module.exports = mongoose.model("Application", applicationSchema);
