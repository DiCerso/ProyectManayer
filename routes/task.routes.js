const express = require('express');
const router = express.Router();
const checkToken = require('../middlewares/checkToken')

const {changeState, detail, list, remove, store, update} = require('../controllers/tasks.controller');

/* /api/task */

router
    .route('/')
        .get(list)
        .post(checkToken,store)
router
    .route('/:id')
        .get(detail)
        .put(update)
        .delete(remove)
router
    .post('/change-state/:id', changeState)


module.exports = router;