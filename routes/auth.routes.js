const express = require('express');
const router = express.Router();

const {register, changePassword, checked, login, sendToken,verifyToken} = require('../controllers/auth.controller');

/* /api/auth */

router
    .post('/register', register)
    .post('/login', login)
    .get('/checked', checked)
    .post('/send-token', sendToken)
    
    .route('/resset-password')
        .get(verifyToken)
        .post(changePassword)


module.exports = router;