const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Meetup = require("./meetups");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/dev");

const userSchema = new Schema({
  avatar: String,
  email: {
    type: String,
    required: "Email is Required",
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  name: {
    type: String,
    required: true,
    minlength: [2, "Too short, min is 2 characters"],
  },
  username: {
    type: String,
    required: true,
    min: [4, "Too short, min is 4 characters"],
  },
  password: {
    type: String,
    minlength: [4, "Too short, min is 4 characters"],
    maxlength: [32, "Too long, max is 32 characters"],
    required: "Password is required",
  },
  active: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "superadmin"],
  },
  info: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  joinedMeetups: [{ type: Schema.Types.ObjectId, ref: "Meetup" }],
});

userSchema.post("remove", removeMeetups);

async function removeMeetups(user, next) {
  try {
    await Meetup.find(
      { meetupCreator: { $in: user._id } },
      function (errors, meetups) {
        if (errors) {
          return next(errors);
        }

        return Promise.all(
          meetups.map((t) => {
            t.remove();
          })
        );
      }
    ).clone();

    next();
  } catch (e) {
    next(e);
  }
}

userSchema.pre("save", function (next) {
  const user = this;

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

//Every user have acces to this methods
(userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
}),
  (userSchema.methods.generateJWT = function () {
    return jwt.sign(
      {
        email: this.email,
        id: this._id,
      },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    avatar: this.avatar,
    name: this.name,
    username: this.username,
    info: this.info,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    joinedMeetups: this.joinedMeetups,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model("User", userSchema);
