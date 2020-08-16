const router = require('express').Router();

const authRoute = require('./auth/auth.route');
const userRoute = require('./users/user.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);

module.exports = router;
