import path from 'path'
/**
 * Data files location.
 */
const STORAGE = path.join(process.cwd(), 'data')
/**
 * @param {*} username 
 * @param {String} plstName - Name of the playlist.
 */
export function playlistPath (username, plstName) {
    return path.join(STORAGE, `plst-${username}-${plstName}.json`)
}
/**
 * @param {mbid} mbid - Music brainz identifier.
 */
export function trackPath(mbid) {
    return path.join(STORAGE, `track-${mbid}.json`)
}