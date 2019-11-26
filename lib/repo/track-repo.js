import * as dao from '../dao/track-dao'
import * as webapi from '../web/track-web-service'
/**
 * @type module:track
 */
import Track from '../model/track'
/**
 * Check for the track with given mbid in Dao.
 * If it does not exist in Dao then it will fetch the track from the web
 * and insert it in Dao.
 * 
 * @param {mbid} mbid - Music brainz identifier.
 * @param {function(Error, Track)} cb
 */
export function findById(mbid, cb) {
    dao.findById(mbid, (err, track) => {
        if(!err) return cb(null, track)
        webapi.getById(mbid, (err, track) => {
            if(err) return cb(err)
            dao.insert(track, (err) => {
                if(err) return cb(err)
                cb(null, track)
            })
        })
    })
}