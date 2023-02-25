const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  photo: String,
  googleID: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
},
{timestamps:true}
);

module.exports = mongoose.model("User", userSchema);

