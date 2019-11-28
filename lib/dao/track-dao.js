import fs from 'fs'
import { trackPath } from './storage'
/**
 * @type module:track
 */
import Track from '../model/track'

/**
 * @param {mbid} mbid - Music brainz identifier.
 * @param {function(Error, Track)} cb
 */
export function findById(mbid, cb) {
    fs.readFile(trackPath(mbid), (err, data) => {
        if(err) return cb(err)
        cb(null, JSON.parse(data.toString()))
    })
}

/**
 * @param {Track} track
 * @param {function(Error)} cb 
 */
export function insert(track, cb) {
    fs.writeFile(
        trackPath(track.mbid),
        JSON.stringify(track),
        cb)
}

/**
 * @param {String} mbid - Music brainz identifier.
 * @param {function(Error)} cb - Called if something wrong happen.
 */
export function remove(mbid, cb) {
    fs.unlink(trackPath(mbid), cb)
}
