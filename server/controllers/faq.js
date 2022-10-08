const Faq = require("../models/faq");

exports.getFaq = function (req, res) {
    Faq.find({}).exec((errors, faq) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(faq);
  });
};

exports.createFaq = function (req, res) {
  const faqData = req.body;
  const user = req.user;
  const faq = new Faq(faqData);

  if (user.role === "user") {
    return res.status(401).send({ errors: { message: "Not Authorized!" } });
  }

  faq.save((errors, createdFaq) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(createdFaq);
  });
};

exports.deleteFaq = function (req, res) {
  const { id } = req.params;
  const user = req.user;

  Faq.findById(id, (errors, faq) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    if (user.role === "user") {
      return res.status(401).send({ errors: { message: "Not Authorized!" } });
    }
    faq.remove((errors, _) => {
      if (errors) {
        console.log(errors.message);
        return res.status(422).send({ errors });
      }
      return res.json(faq._id);
    });
  });
};
