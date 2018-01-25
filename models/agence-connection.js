'use strict'

var mysql = require('mysql'), // node-mysql module
    conf = require('./db-conf'),
    dbOptions = {
        host: conf.mysql.host,
        port: conf.mysql.port,
        user: conf.mysql.user,
        password: conf.mysql.pass,
        database: conf.mysql.db
    },
    myConnection = mysql.createConnection(dbOptions)

myConnection.connect((err) => {
    return (err) ? console.log(`Error al conectar a mysql: ${err.stack}`) : console.log(`conexion establecida con mysql n°: ${myConnection.threadId}`)
})
module.exports = myConnection