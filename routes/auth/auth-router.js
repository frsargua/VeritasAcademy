const router = require('express').Router();
const {
  signUp_post,
  SignIn_post,
  signOut_post,
} = require('../../controllers/auth/auth');

router.post('/signUp', signUp_post);

router.post('/signIn', SignIn_post);

router.post('/signOut', signOut_post);

module.exports = router;
