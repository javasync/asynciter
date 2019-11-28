import * as dao from './../lib/dao/track-dao'
import * as repo from './../lib/repo/track-repo'

test('Get Atomic track from Repository via Dao', (done) => {
    const atomic = '66083e09-9486-43f7-98c4-8253c9a5da58'
    repo.findById(atomic, (err, track) => {
        expect(err).not.toBeTruthy()
        expect(track.name).toEqual('Atomic')
        done()
    })
})

test('Getting illegal mbid from Repository raises an error', (done) => {
    const atomic = 'lksajljdfl-adlfadlçj'
    repo.findById(atomic, err => {
        expect(err).toBeTruthy()
        done()
    })
})

test('Get Starlight from Repository, check it via Dao but fectch it from the Web', (done) => {
    const starlight = '60e94685-0481-4d3d-bd84-11c389d9b2a5'
    /**
     * 1. Confirm that DB is empty and no track is returned.
     */
    dao.findById(starlight, (err) => {
        expect(err).toBeTruthy()
        /**
         * 2. Repo tries to get Track and because it cannot find it,
         * then repo will fetch the Track from the Web API and insert it on DB.
         */
        repo.findById(starlight, (err, track) => {
            expect(err).not.toBeTruthy()
            expect(track.name).toEqual('Starlight')
            /**
             * 3. After that we can get it sucessfuly via Dao.
             */
            dao.findById(starlight, (err) => {
                expect(err).not.toBeTruthy()
                expect(track.name).toEqual('Starlight')
                /**
                 * 4. After that we may remove starlight track from DB
                 */
                dao.remove(starlight, (err) => {
                    expect(err).not.toBeTruthy()
                    /**
                     * 5. Now if we try to find it via DAO we will get an Error
                     */
                    dao.findById(starlight, (err) => {
                        expect(err).toBeTruthy()
                        done()
                    })
                })
            })
        })
    })
})