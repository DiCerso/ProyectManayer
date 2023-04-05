const express = require('express');
const router = express.Router();

const {profile, users} = require('../controllers/users.controller');
const checkToken = require('../middlewares/checkToken');

/* /api/users */
router
    .get('/', checkToken, users)
    .get('/profile', checkToken, profile)

module.exports = router;

