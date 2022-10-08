const express = require('express');
const router = express.Router();

const FeedbackCtrl = require('../controllers/feedback');
const AuthCtrl = require('../controllers/auth');

router.get('', AuthCtrl.onlyAuthUser, FeedbackCtrl.getFeedback);

router.post('', FeedbackCtrl.createFeedback);
router.delete('/:id', AuthCtrl.onlyAuthUser, FeedbackCtrl.deleteFeedback);

module.exports = router;
