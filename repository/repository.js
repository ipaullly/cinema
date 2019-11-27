'use strict'

// factory function that holds the open connection to db.
// exposes functions that access data
const repository = (db) => {
    // query 'movies' collection in all the functions
    const collection = db.collection('movies')
    const getMoviePremiers = () => {
        return new Promise((resolve, reject) => {
            const movies = []
            const currentDay = new Date()
            const query = {
                releaseYear: {
                    $gt: currentDay.getFullYear() - 1,
                    $lte: currentDay.getFullYear()
                },
                releaseMonth: {
                    $gt: currentDay.getMonth() + 1,
                    $lte: currentDay.getMonth() + 2
                },
                releaseDay: {
                    $lte: currentDay.getDate()
                }
            }
            const cursor = collection.find(query)
            const addMovie = (movie) => {
                movies.push(movie)
            }
            const sendMovies = (err) => {
                if (err) {
                    reject(new Error('An error occured while fecthing all movies, err:' + err))
                }
                resolve(movies)
            }
            cursor.forEach(addMovie, sendMovies)
        })
    }
    const getMovieById = (id) => {
        return new Promise((resolve, reject) => {
            const projection = { _id: 0, id: 1, title: 1, format: 1 }
            const sendMovie = (err, movie) => {
                if (err) {
                    reject(new Error(`An error occured while fetching a movie with id: ${id}, err: ${err}`))
                }
                resolve(movie)
            }
            // fetch a movie by id -- mongodb syntax
            collection.findOne({ id: id}, projection, sendMovie)
        })
    }
    // close database connection
    const disconnect = () => {
        db.close()
    }

    return Object.create({
        getAllMovies,
        getMoviePremiers,
        getMovieById,
        disconnect
    })
}

const connect = (connection) => {
    return new Promise((resolve, reject) => {
        if (!connection) {
            reject(new Error('connection db not supplied!'))
        }
        resolve(repository(connection))
    })
}
// this only exports a connected repo
module.exports = Object.assign({}, {connect})