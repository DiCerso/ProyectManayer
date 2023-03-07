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
    .route('/change-state/:id')
        .put(checkToken, changeState)
router
    .route('/:idtask/:idproject?')
        .get(checkToken,detail)
        .put(checkToken,update)
        .delete(checkToken,remove)



module.exports = router;