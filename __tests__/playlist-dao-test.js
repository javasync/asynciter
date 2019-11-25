import * as dao from './../lib/dao/playlist-dao'
import Playlist from './../lib/model/playlist'

const electric = [
    '66083e09-9486-43f7-98c4-8253c9a5da58',
    '89f3b3a8-a63f-4d62-a9a5-fe7b740181d0',
    '9aa2be7b-8fb0-4187-bce4-9bb4e84815fc'
]

test('Playlist insert, find and delete', done => {
    const expected = new Playlist('gamboa', 'metal', 'All hard rock musics')
    dao.insert(expected, (err) => {
        expect(err).toBeNull()
        dao.findById('gamboa', 'metal', (err, actual) => {
            expect(err).toBeNull()
            expect(actual).toEqual(expected)
            dao.remove('gamboa', 'metal', (err) => {
                expect(err).toBeNull()
                done()
            })
        })
    })
})

test('Add track to playlist, check it and remove it', done => {
    const forthekill = '3d1b81ec-b87d-462c-9a50-1a587e32edb0'
    /**
     * 1. Add track forthekill to gamboa's electric playlist.
     */
    dao.addTrack('gamboa', 'electric', forthekill, (err) => {
        expect(err).not.toBeTruthy()
        const expected = electric.concat([forthekill])
        /**
         * 2. Expect to find all former 3 tracks and the new one forthekill
         */
        dao.getTracks('gamboa', 'electric', (err, arr) => {
            expect(err).not.toBeTruthy()
            expect(arr).toEqual(expected)
            /**
             * 3. Remove forthekill and 9aa2be7b-8fb0-4187-bce4-9bb4e84815fc
             */
            dao.removeTrack('gamboa', 'electric', '9aa2be7b-8fb0-4187-bce4-9bb4e84815fc', err => {
                expect(err).not.toBeTruthy()
                dao.removeTrack('gamboa', 'electric', forthekill, err => {
                    expect(err).not.toBeTruthy()
                    /**
                     * 4. Expect to find only 2 tracks. 
                     */
                    const suppressed = expected.filter(mbid => 
                        mbid != '9aa2be7b-8fb0-4187-bce4-9bb4e84815fc' && mbid != forthekill)
                    dao.getTracks('gamboa', 'electric', (err, arr) => {
                        expect(err).not.toBeTruthy()
                        expect(arr).toEqual(suppressed)
                        /**
                         * 5. Put again the mbid 9aa2be7b-8fb0-4187-bce4-9bb4e84815fc in the playlist
                         */
                        dao.addTrack('gamboa', 'electric', '9aa2be7b-8fb0-4187-bce4-9bb4e84815fc', err => {
                            expect(err).not.toBeTruthy()
                            done()
                        })                        
                    })
                })
            })
        })
    })
})

test('Check for absent playlist', (done) => {
    dao.findById('gamboa', 'techno', err => {
        expect(err).toBeTruthy()
        done()
    })
})

test('Check for tracks of absent playlist', done => {
    dao.getTracks('gamboa', 'techno', err => {
        expect(err).toBeTruthy()
        done()
    })
})
