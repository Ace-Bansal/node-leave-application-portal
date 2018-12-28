var mongoose = require("mongoose");

var applicationSchema = new mongoose.Schema({
  submitter: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  from: String,
  to: String,
  totalDays: Number,
  reasonForLeave: String,
  natureOfLeave: String,
  isAccepted: {
    type: String,
    default: "waiting"
  }
})

module.exports = mongoose.model("Application", applicationSchema);
