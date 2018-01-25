'use strict'

var AgenceController = require('../controllers/agence-controller'),
    express = require('express'),
    router = express.Router()

router
    .get('/getAllJson', AgenceController.getAllJson)
    .post('/getRelatorio', AgenceController.getRelatorio)
    .get('/', AgenceController.getAll)
    .post('/getDatosPizza', AgenceController.getDatosPizza)
    .post('/getDatosBarra', AgenceController.getDatosBarra)

.use(AgenceController.error404)

module.exports = router