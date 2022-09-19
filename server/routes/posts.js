const express = require('express');
const router = express.Router();

const PostsCtrl = require('../controllers/posts');
const AuthCtrl = require('../controllers/auth');

router.get('', PostsCtrl.getPosts);


router.post('', AuthCtrl.onlyAuthUser, PostsCtrl.createPost);
router.delete('/:id', AuthCtrl.onlyAuthUser, PostsCtrl.deletePost);

module.exports = router;
