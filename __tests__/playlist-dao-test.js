import dao from './../lib/dao/playlist-dao'
import Playlist from './../lib/model/playlist'

test('Playlist insert, find and delete', (done) => {
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

