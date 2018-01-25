'use strict'

var AgenceModel = require('../models/agence-model'),
    AgenceController = () => {}

AgenceController.getAll = (req, res, next) => {
    AgenceModel.getAll((err, rows) => {
        if (err) {
            let locals = {
                title: 'Error al consultar la base de datos',
                descripction: 'Error de sintaxis SQL',
                error: err
            }
            res.render('error', locals)
        } else {
            let locals = {
                title: 'Listado de Consultores',
                data: rows
            }

            res.render('index', locals)
        }
    })
}

AgenceController.getAllJson = (req, res, next) => {
    AgenceModel.getAll((err, rows) => {
        if (err) {
            let locals = {
                title: 'Error al consultar la base de datos',
                descripction: 'Error de sintaxis SQL',
                error: err
            }
            res.json(locals)
        } else {
            let locals = {
                title: 'Listado',
                data: rows
            }
            console.log(rows)
            res.json(rows)
        }
    })
}


AgenceController.getDatosPizza = (req, res, next) => {
    console.log(req.body)
    let datos = {
        co_usuario: req.body.co_usuario,
        anioInicio: req.body.anioInicio,
        anioFin: req.body.anioFin,
        mesInicio: req.body.mesInicio,
        mesFin: req.body.mesFin
    }

    AgenceModel.getDatosPizza(datos, (err, rows) => {
        if (err) {
            let locals = {
                title: 'Error al consultar la base de datos',
                descripction: 'Error de sintaxis SQL',
                error: err
            }
            res.json(locals)
        } else {
            let locals = {
                title: 'Lista datos',
                data: rows
            }
            console.log(rows)
            res.json(rows)
        }
    })
}
AgenceController.getDatosBarra = (req, res, next) => {
    console.log(req.body)
    let datos = {
        co_usuario: req.body.co_usuario,
        anioFin: req.body.anioFin,
        mesInicio: req.body.mesInicio,
        mesFin: req.body.mesFin
    }

    AgenceModel.getDatosBarra(datos, (err, rows) => {
        if (err) {
            let locals = {
                title: 'Error al consultar la base de datos',
                descripction: 'Error de sintaxis SQL',
                error: err
            }
            res.json(locals)
        } else {
            let locals = {
                title: 'Lista datos',
                data: rows
            }
            console.log(rows)
            res.json(rows)
        }
    })
}

AgenceController.getRelatorio = (req, res, next) => {
    console.log(req.body)
    let relatorio = {
        co_usuario: req.body.co_usuario,
        anioInicio: req.body.anioInicio,
        anioFin: req.body.anioFin,
        mesInicio: req.body.mesInicio,
        mesFin: req.body.mesFin
    }

    AgenceModel.getRelatorio(relatorio, (err, rows) => {
        if (err) {
            let locals = {
                title: 'Error al consultar la base de datos',
                descripction: 'Error de sintaxis SQL',
                error: err
            }
            res.json(locals)
        } else {
            let locals = {
                title: 'Lista peliculas',
                data: rows
            }
            console.log(rows)
            res.json(rows)
        }
    })
}

AgenceController.error404 = (req, res, next) => {
    let error = new Error(),
        locals = {
            title: 'Error 404',
            descripcion: 'Recurso no encontrado',
            error: error
        }

    error.status = 404

    res.render('error', locals)

    next()
}

module.exports = AgenceController