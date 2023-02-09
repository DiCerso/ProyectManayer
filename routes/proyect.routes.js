const express = require('express');
const router = express.Router();

const {addCollaborator, detail, list, removeCollaborator, store, update, remove} = require('../controllers/proyects.controller');

/* /api/proyect */

router
    .route('/')
        .get(list)
        .post(store)
router
    .route('/:id')
        .get(detail)
        .put(update)
        .delete(remove)
router
    .get('/collaborator/add', addCollaborator)
    .delete('/collaborator/remove', removeCollaborator)

module.exports = router;