const Category = require('../models/categories');

exports.getCategories = function(req, res) {
  Category.find({})
        .exec((errors, categories) => {

    if (errors) {
      return res.status(422).send({errors});
    }

    return res.json(categories);
  });
}

exports.createCategories = function (req, res) {
  const categoryData = req.body
  const category = new Category(categoryData)
  

  category.save((errors, createdCategory) => {
    if (errors) {
      return res.status(422).send({errors});
    }

    return res.json(createdCategory)
  });
}

exports.deleteCategory = function(req, res) {
  const {id} = req.params;
  const user = req.user;

  Category.findById(id, (errors, category) => {
    if (errors) {
      return res.status(422).send({errors})
    }

    if (user.role === 'user') {
      return res.status(401).send({errors: {message: 'Not Authorized!'}})
    }
    category.remove((errors, _) => {
      if (errors) {
        console.log(errors.message)
        return res.status(422).send({errors})
      }
      return res.json(category._id);
    })
  })
}


