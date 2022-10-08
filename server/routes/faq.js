const express = require('express');
const router = express.Router();

const faqCtrl = require('../controllers/faq');
const AuthCtrl = require('../controllers/auth');

router.get('', faqCtrl.getFaq);

router.post('', AuthCtrl.onlyAuthUser, faqCtrl.createFaq);
router.delete('/:id', AuthCtrl.onlyAuthUser, faqCtrl.deleteFaq);

module.exports = router;
