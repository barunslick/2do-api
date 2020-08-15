const router = require('express').Router();

const authRoute = require('./auth/auth.route');

router.use('/auth', authRoute);

module.exports = router;
