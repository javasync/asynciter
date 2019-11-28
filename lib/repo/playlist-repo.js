import * as dao from '../dao/playlist-dao'
import * as tracks from '../repo/track-repo'
/**
 * @type module:playlist
 */
import Playlist from '../model/playlist'
/**
 * @type module:track
 */
import Track from '../model/track'
import { playlistTracksPath } from '../dao/storage'
/**
 * Gets from the playlist-dao the mbids of tracks belonging to the playlist
 * given by username and plstName.
 * Gets for each mbid the detailed track information from the track-dao.
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error, Track[])} cb - Handles an array of track objects.
 */
export function getTracks(username, plstName, cb) {
    dao.getTracks(username, plstName, (err, arr) => {
        if(err) return cb(err)
        const res = []
        /**
         * Runs concurrently.
         */
        arr = arr.filter(mbid => mbid != '')
        arr.forEach(mbid => {
                tracks.findById(mbid, (err, t) => {
                    if(err) return cb(err)
                    res.push(t)
                    if(res.length >= arr.length)
                        cb(null, res)
                })
            })
    })
}

/**
 * If the playlist does not exist in Dao then creates a new one
 * and return it to the callback.
 * 
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error, Playlist)} cb
 */
export function findById(username, plstName, cb) {
    dao.findById(username, plstName, (err, plst) => {
        /**
         * The playlist already exists in Dao.
         */
        if(!err) return cb(null, plst)
        /**
         * Otherwise create a new playlist.
         */
        plst = new Playlist(username, plstName, '')
        dao.insert(plst, err => {
            if(err) return cb(err)
            cb(null, plst)
        })
    })
}

/**
 * @param {String} username
 * @param {String} plstName - Name of the playlist.
 * @param {function(Error, Playlist)} cb
 */
export function remove(username, plstName, cb) {
    dao.remove(username, plstName, cb)
}

/**
 * Following  a naif approach to run two tasks concurrently:
 * 1. Try to get and insert the track via repository
 * 2. Try to get and insert the playlist via repository
 * 
 * @param {String} username - Owner of the playlist.
 * @param {String} plstName - Name of the playlist.
 * @param {String} mbid - Music brainz identifier.
 * @param {function(Error)} cb 
 */
export function addTrack(username, plstName, mbid, cb) {
    addTrackConcurr(username, plstName, mbid, cb) 
}

export function addTrackConcurr(username, plstName, mbid, cb) {
    let plst, track, finished
    const handler = err => {
        if(finished) return // already finished
        if(err) { finished = true; return cb(err); } // failed
        if(plst && track) {
            if(plst.name != plstName || plst.username != username)
                return cb(Error('Error inserting playlist!'))
            if(track.mbid != mbid)
                return cb(Error('Error fetching track!'))
            /**
             * 3. Insert track mbid in the playlist if both exist.
             */
            dao.addTrack(username, plstName, mbid, cb)
        }
    }
    /**
     * 1. Checks for track with mbid in Dao. 
     * If it doesn't find the track in Dao then fetch the track from the Web.
     */
    tracks.findById(mbid, (err, t) => {
        if(err) return handler(err)
        track = t
        handler(null)
    })
    /**
     * 2. Checks for the playlist and creates if it does not exist.
     */
    findById(username, plstName, (err, playlist) => {
        if(err) return handler(err)
        plst = playlist
        handler(null)
    })
}

export function addTrackSeq(username, plstName, mbid, cb) {
    /**
     * 1. Checks for track with mbid in Dao. 
     * If it doesn't find the track in Dao then fetch the track from the Web.
     */
    tracks.findById(mbid, (err, t) => {
        if(err) return cb(err)
        /**
         * 2. Checks for the playlist and creates if it does not exist.
         */
        findById(username, plstName, (err, playlist) => {
            if(err) return cb(err)
            /**
             * 3. Insert track mbid in the playlist if both exist.
             */
            dao.addTrack(username, plstName, mbid, cb)            
        })
    })
}
