const express = require('express');
const { body } = require('express-validator');

const getPage = require('../controllers/get-page');
const auth = require('../controllers/auth');
const routesProtection = require('../middleware/routes-protection');
const post = require('../controllers/post');
const changeAvatar = require('../controllers/change-avatar');
const users = require('../controllers/users');

const router = express.Router();

router.get('/signup', getPage.signUp);
router.post('/signup', auth.signUp);

router.get('/signin', getPage.signIn);
router.post('/signin', auth.signIn);

router.get('/signout', auth.signOut);

router.get('/', routesProtection, getPage.index);

router.get('/add-post', routesProtection, getPage.addPost);
router.post('/add-post', post.addPost);

router.get('/delete-post', routesProtection, getPage.deletePost);
router.post('/delete-post', post.deletePost);

router.get('/profile', routesProtection, getPage.profile);

router.post('/change-avatar', changeAvatar);

router.get('/search', routesProtection, users.search);

router.post('/follow', users.follow);

router.get('/following', routesProtection, users.following);

router.post('/like', post.like);

module.exports = router;