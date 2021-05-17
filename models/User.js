const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
