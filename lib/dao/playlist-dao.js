import fs from 'fs'
import os from 'os'
/**
 * @type module:playlist
 */
import Playlist from '../model/playlist'
/**
 * @type module:track
 */
import Track from '../model/track'
import { playlistPath, playlistTracksPath } from './storage'
import { file } from '@babel/types'

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error, Playlist)} cb - Called if something wrong happen.
 */
export function findById(username, plstName, cb) {
    fs.readFile(playlistPath(username, plstName), (err, data) => {
        if(err) return cb(err)
        cb(null, JSON.parse(data.toString()))
    })
}

/**
 * @param {Playlist} plst - Playlist object.
 * @param {function(Error)} cb 
 */
export function insert(plst, cb) {
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
export function remove(username, plstName, cb) {
    fs.unlink(playlistPath(username, plstName), err => {
        if(err)
            return cb(err)
        fs.unlink(playlistTracksPath(username, plstName), err => {}) // Ignore error for empty playlists
        cb()
    }) 
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {String} mbid - Track's music brainz identifier.
 * @param {function(Error)} cb  - Called if something wrong happen.
 */
export function addTrack(username, plstName, mbid, cb) {
    fs.appendFile(
        playlistTracksPath(username, plstName),
        os.EOL + mbid,
        cb)
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {String} mbid - Track's music brainz identifier.
 * @param {function(Error)} cb  - Called if something wrong happen.
  */
export function removeTrack(username, plstName, mbid, cb) {
    const filename = playlistTracksPath(username, plstName)
    fs.readFile(filename, (err, data) => {
        if(err) return cb(err)
        const body = data.toString().replace(os.EOL + mbid, '')
        fs.writeFile(filename, body, cb)
    })
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error, String[])} cb - Handles an array of strings with mbid of each track.
 */
export function getTracks(username, plstName, cb) {
    const filename = playlistTracksPath(username, plstName)
    fs.readFile(filename, (err, data) => {
        if(err) return cb(err)
        const arr = data.toString().split(os.EOL)
        cb(null, arr)
    })
}
