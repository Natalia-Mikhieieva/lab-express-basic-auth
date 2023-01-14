const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minLength: [7, "please enter a password at least 7 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
