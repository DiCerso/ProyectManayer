const express = require('express');
const router = express.Router();

const {addCollaborator, detail, list, removeCollaborator, store, update, remove, viewcollaborators} = require('../controllers/proyects.controller');

/* /api/projects */

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
    .post('/collaborator/:projectid/:id', addCollaborator)
    .delete('/collaborator/:projectid/:id', removeCollaborator)

module.exports = router;