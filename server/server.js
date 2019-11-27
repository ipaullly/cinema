'use strict'
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const movieAPI = require('../api/movies')

const start = (options) => {
    return new Promise((resolve, reject) => {
        //verify if repository has been added and a server port running
        if (!options.repo) {
            reject(new Error('The server must be started with a connected repository'))
        }
        if (!options.port) {
            reject(new Error('The server must be started with an available port'))
        }
        //initialise express app and middlewares
        const app = express()
        app.use(morgan('dev'))
        app.use(helmet())
        app.use((err, req, res, next) => {
            reject(new Error('Something went wrong, err:' + err))
            res.status(500).send('Error occured!')
        })

        // add APIs to the express app
        movieAPI(app, otions)

        // start server and return newly created server
        const server = app.listen(options.port, () => resolve(server))
    })
}

module.exports = Object.assign({}, {start})
