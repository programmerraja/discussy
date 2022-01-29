var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { String,Number } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required:true
    },
    isEmailVerified:{
      type:Boolean,
      default:false
    },
    passwordResetToken:{
      type:String
    },
    passwordResetExpires:{
      type:Date
    }
  },
  { timestamps: true }
);

UserSchema.methods = {
  checkPassword: function (inputPassword) {
    // console.log("checkPassword ",inputPassword)
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: (plainTextPassword) => {
    // console.log("hased new",plainTextPassword)
    return bcrypt.hashSync(plainTextPassword, 10);
  }
};

// Define hooks for pre-saving
UserSchema.pre("save", function (next) {
  if (!this.password) {
    next();
  } else {
    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;


