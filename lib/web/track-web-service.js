import request from 'request'
import fs from 'fs'
import path from 'path'
/**
 * @type module:track
 */
import Track from '../model/track'

const API_KEY = getLastFmApiKey('lastfmapikey.txt')
const HOST = 'http://ws.audioscrobbler.com/2.0'
const PATH = '/?method=track.getInfo&format=json'

/**
 * @param {String} mbid 
 * @param {function(Error, Track)} cb 
 */
export function getById(mbid, cb) {
    request(url(mbid), (err, resp, body) => {
        if(err) return cb(err)
        if(resp.statusCode != 200) 
            return cb(Error(`Failed to fetch track with HTTP status code: ${resp.statusCode}`))
        const dto = JSON.parse(body)
        if(dto.error)
            return cb(Error(dto.error.message))
        cb(null, dto.track)
    })
}

export function url(mbid) {
    return `${HOST}${PATH}&api_key=${API_KEY}&mbid=${mbid}`
}

export function getLastFmApiKey(file) {
    try {
        const uri = path.join(process.cwd(), file)
        return fs.readFileSync(uri).toString()
    } catch (error) {
        throw Error('You should provide the last.fm API key in root file lastfmapikey.txt')
    }
}