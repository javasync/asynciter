import path from 'path'

module.exports = {
    filename
}

/**
 * Data files location.
 */
const STORAGE = path.join(process.cwd(), 'data')
/**
 * @param {*} username 
 * @param {String} plstName - Name of the playlist.
 */
function filename (username, plstName) {
    return path.join(STORAGE, `plst-${username}-${plstName}.json`)
}