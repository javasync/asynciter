import * as webapi from './../lib/web/track-web-service'
import * as dao from './../lib/dao/track-dao'

test('Save Starlight track locally, read it and delete it', (done) => {
    const starlight = '60e94685-0481-4d3d-bd84-11c389d9b2a5'
    dao.findById(starlight, (err) => {
        expect(err).toBeTruthy()
        webapi.getById(starlight, (err, track) => {
            expect(err).not.toBeTruthy()
            expect(track.name).toEqual('Starlight')
            dao.insert(track, (err) => {
                expect(err).not.toBeTruthy()
                dao.findById(starlight, (err, expected) => {
                    expect(err).not.toBeTruthy()
                    expect(expected.name).toEqual('Starlight')
                    dao.remove(starlight, (err) => {
                        expect(err).not.toBeTruthy()
                        dao.findById(starlight, (err) => {
                            expect(err).toBeTruthy()
                            done()
                        })
                    })
                })
            })
        })
    })
})