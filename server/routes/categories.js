const express = require('express');
const router = express.Router();

const CategoriesCtrl = require('../controllers/categories');
const AuthCtrl = require('../controllers/auth');

router.get('', CategoriesCtrl.getCategories);

router.post('', AuthCtrl.onlyAuthUser, CategoriesCtrl.createCategories);
router.delete('/:id', AuthCtrl.onlyAuthUser, CategoriesCtrl.deleteCategory);

module.exports = router;
