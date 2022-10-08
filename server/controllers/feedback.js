const Feedback = require("../models/feedback");

exports.getFeedback = function (req, res) {
  Feedback.find({}).exec((errors, feedback) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(feedback);
  });
};

exports.createFeedback = function (req, res) {
  const feedbackData = req.body;
  const feedback = new Feedback(feedbackData);

  feedback.save((errors, createdFeedback) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(createdFeedback);
  });
};

exports.deleteFeedback = function (req, res) {
  const { id } = req.params;
  const user = req.user;

  Feedback.findById(id, (errors, feedback) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    if (user.role === "user") {
      return res.status(401).send({ errors: { message: "Not Authorized!" } });
    }
    feedback.remove((errors, _) => {
      if (errors) {
        console.log(errors.message);
        return res.status(422).send({ errors });
      }
      return res.json(feedback._id);
    });
  });
};
