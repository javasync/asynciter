/**
 * As returned by last.fm API track getinfo.
 */
export default class Track {
    /**
     * @param {String} name
     * @param {String} mbid
     * @param {String} url
     * @param {Number} duration
     * @param {Number} listeners
     * @param {Number} playcount
     * @param {Artist} artist
     */
    constructor(name, mbid, url, duration, listener, playcount, artist) {
        this.name = name
        this.mbid = mbid
        this.url = url
        this.duration = duration
        this.listener = listener
        this.playcoun = playcoun
        this.artist = artist
    }
}