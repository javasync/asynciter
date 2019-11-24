import fs from 'fs'

/**
 * @type module:playlist
 */
import Playlist from '../model/playlist'
import { playlistPath } from './storage'

export default {
    findById,
    insert,
    remove
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error, Playlist)} cb - Called if something wrong happen.
 */
function findById(username, plstName, cb) {
    fs.readFile(playlistPath(username, plstName), (err, data) => {
        if(err) return cb(err)
        cb(null, JSON.parse(data.toString()))
    })
}

/**
 * @param {Playlist} plst - Playlist object.
 * @param {function(Error)} cb 
 */
function insert(plst, cb) {
    fs.writeFile(
        playlistPath(plst.username, plst.name),
        JSON.stringify(plst),
        cb)
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error)} cb - Called if something wrong happen.
 */
function remove(username, plstName, cb) {
    fs.unlink(playlistPath(username, plstName), cb)
}
