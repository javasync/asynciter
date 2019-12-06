const writeFile = require('fs').promises.writeFile
const readFile = require('fs').promises.readFile
const unlink = require('fs').promises.unlink
const appendFile = require('fs').promises.appendFile

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
 * @returns {Promise<Playlist>}
 **/
export async function findById(username, plstName) {
    const data = await readFile(playlistPath(username, plstName))
    return JSON.parse(data.toString())
}

/**
 * @param {Playlist} plst - Playlist object.
 * @returns {Promise<void>} 
 */
export function insert(plst) {
    return writeFile(
        playlistPath(plst.username, plst.name),
        JSON.stringify(plst))
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @returns {Promise<void>}
 */
export function remove(username, plstName) {
    const res = unlink(playlistPath(username, plstName))
    res.then(() => unlink(playlistTracksPath(username, plstName))) // Ignore error for empty playlists
    return res
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {String} mbid - Track's music brainz identifier.
 * @returns {Promise<void>}
 */
export function addTrack(username, plstName, mbid) {
    return appendFile(
        playlistTracksPath(username, plstName),
        os.EOL + mbid)
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {String} mbid - Track's music brainz identifier.
 * @returns {Promise<void>}
 */
export async function removeTrack(username, plstName, mbid) {
    const filename = playlistTracksPath(username, plstName)
    const data = await readFile(filename)
    const body = data.toString().replace(os.EOL + mbid, '')
    return writeFile(filename, body)
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @returns {Promise<String[]>} - Returns a promise of an array of strings with the mbid of each track.
 */
export async function getTracks(username, plstName) {
    const filename = playlistTracksPath(username, plstName)
    const data = await readFile(filename)
    return data.toString().split(os.EOL)
}
