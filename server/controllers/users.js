const User = require("../models/users");
const Meetup = require("../models/meetups");
const Thread = require("../models/threads");
const Post = require("../models/posts");
const Category = require("../models/categories");
const passport = require("passport");
const ConfirmationHash = require("../models/confirmation-hash");
const nodemailer = require("nodemailer");
const config = require("../config/dev");
const ConnectMongoDBSession = require("connect-mongodb-session");

function sendConfirmation({ toUser, hash }, callback) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.GOOGLE_USER,
      pass: config.GOOGLE_PASSWORD,
    },
  });
  const message = {
    from: config.GOOGLE_USER,
    // to: toUser.email  uncomment after test
    to: toUser.email,
    subject: "Kosmeetuper - Activate your account",
    html: `
    <h3> Hello ${toUser.name} </h3>
    <p>Thank you for registering into Kosmeetuper. Just one last step is laying ahead of you to join our awesome community.</p>
    <p>To activate your account please follow this link: <a target="_" href="${config.DOMAIN}/users/${hash}/activate">${config.DOMAIN}/activate </a></p>
    <p>Cheers</p>
    <p>Your Kosmeetuper Team</p>
  `,
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, info);
    }
  });
}

exports.activateUser = function (req, res) {
  const { hash } = req.params;

  ConfirmationHash.findById(hash)
    .populate("user")
    .exec((errors, foundHash) => {
      if (errors) {
        return res.status(422).send({ errors });
      }

      User.findByIdAndUpdate(
        foundHash.user._id,
        { $set: { active: true } },
        { new: true },
        (errors, updatedUser) => {
          if (errors) {
            console.log(errors.message)
            return res.status(422).send({ errors });
          }
          foundHash.remove(() => {});
          return res.json(updatedUser);
        }
      );
    });
};

exports.getUsers = function (req, res) {
  User.find({}).exec((errors, users) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(users);
  });
};

exports.getCurrentUser = function (req, res, next) {
  const user = req.user;
  if (!user) {
    return res.sendStatus(422);
  }

  return res.json(user.toAuthJSON());
};

exports.register = function (req, res) {
  const registerData = req.body;

  if (!registerData.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
        message: "Email is required",
      },
    });
  }

  if (!registerData.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
        message: "Password is required",
      },
    });
  }

  if (registerData.password !== registerData.passwordConfirmation) {
    return res.status(422).json({
      errors: {
        password: "is not the same as confirmation password",
        message: "Password is not the same as confirmation password",
      },
    });
  }

  const user = new User(registerData);
  return user.save((errors, savedUser) => {
    if (errors) {
      return res.status(422).json({ errors });
    }
    const hash = new ConfirmationHash({ user: savedUser });
    hash.save((errors, createdHash) => {
      if (errors) {
        return res.status(422).json({ errors });
      }
      sendConfirmation({ toUser: savedUser, hash: hash.id }, (error, info) => {
        if (errors) {
          return res.status(422).json({ errors });
        }
        return res.json(savedUser);
      });
      return res.json(savedUser);
    });
  });
};

exports.login = function (req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({
      errors: {
        email: "is required",
        message: "Email is required",
      },
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: "is required",
        message: "Password is required",
      },
    });
  }

  return passport.authenticate("local", (err, passportUser) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      if (passportUser.active) {
        return res.json(passportUser.toAuthJSON());
      } else {
        return res.status(422).send({
          errors: {
            message: "Please check your email to activate your account!",
          },
        });
      }
    } else {
      return res.status(422).send({
        errors: {
          message: "Invalid email or password!",
        },
      });
    }
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  return res.json({ status: "Session destroyed!" });
};

function fetchMeetupsByUserQuery(userId) {
  return Meetup.aggregate([
    {
      $facet: {
        meetups: [
          { $match: { meetupCreator: userId } },
          { $limit: 5 },
          { $sort: { createdAt: -1 } },
        ],
        meetupsCount: [
          { $match: { meetupCreator: userId } },
          { $count: "count" },
        ],
      },
    },
  ])
    .exec()
    .then((results) => {
      return new Promise((resolve, reject) => {
        Category.populate(results[0].meetups, { path: "category" }).then(
          (pMeetups) => {
            if (pMeetups && pMeetups.length > 0) {
              resolve({
                data: pMeetups,
                count: results[0].meetupsCount[0].count,
              });
            } else {
              resolve({ data: results[0].meetups, count: 0 });
            }
          }
        );
      });
    });
}

function fetchThreadsByUserQuery(userId) {
  return Thread.aggregate([
    {
      $facet: {
        threads: [
          { $match: { user: userId } },
          { $limit: 5 },
          { $sort: { createdAt: -1 } },
        ],
        threadsCount: [{ $match: { user: userId } }, { $count: "count" }],
      },
    },
  ])
    .exec()
    .then((results) => {
      const threads = results[0].threads;
      if (threads && threads.length > 0) {
        return { data: threads, count: results[0].threadsCount[0].count };
      }

      return { data: threads, count: 0 };
    });
}

function fetchPostByUserQuery(userId) {
  return Post.aggregate([
    {
      $facet: {
        posts: [
          { $match: { user: userId } },
          { $limit: 5 },
          { $sort: { createdAt: -1 } },
        ],
        postsCount: [{ $match: { user: userId } }, { $count: "count" }],
      },
    },
  ])
    .exec()
    .then((results) => {
      const posts = results[0].posts;
      if (posts && posts.length > 0) {
        return {
          data: results[0].posts,
          count: results[0].postsCount[0].count,
        };
      }

      return { data: results[0].posts, count: 0 };
    });
}

exports.getUserActivity = function (req, res) {
  const userId = req.user._id;

  Promise.all([
    fetchMeetupsByUserQuery(userId),
    fetchThreadsByUserQuery(userId),
    fetchPostByUserQuery(userId),
  ])
    // Writing [] to get data from the array

    .then(([meetups, threads, posts]) => res.json({ meetups, threads, posts }))
    .catch((err) => {
      console.log(err);
      res.status(422).send({ err });
    });
};

exports.getJoinedMeetups = function (req, res) {
  const userId = req.user._id;

  Meetup.find({ joinedPeople: { $in: userId } }).exec((errors, meetups) => {
    if (errors) {
      return res.status(422).send({ errors });
    }
    return res.json(meetups);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  const user = req.user;

  if (user.id === userId || user.role === "admin") {
    // new: bool - true to return the modified document rather than the original. defaults to false
    User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true },
      (errors, updatedUser) => {
        if (errors) return res.status(422).send({ errors });

        return res.json(updatedUser);
      }
    );
  } else {
    return res.status(422).send({ errors: "Authorization Error!" });
  }
};

exports.deleteUser = function (req, res) {
  const { id } = req.params;
  const currentUser = req.user;

  User.findById(id, (errors, user) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    if (currentUser.role === "user") {
      return res.status(401).send({ errors: { message: "Not Authorized!" } });
    }
    user.remove((errors, _) => {
      if (errors) {
        console.log("error: " + errors.message);
        return res.status(422).send({ errors });
      }
      return res.json(user._id);
    });
  });
};
