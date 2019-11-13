const { expect } = require('chai')
const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders.fixtures')
const { makeNotesArray, makeMaliciousNote } = require('./notes.fixtures')

describe(`Folders endpoints`, function() {
    let db;

    before(`Make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw(`TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE`))

    afterEach('cleanup',() => db.raw(`TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE`))

    describe(`GET /api/folders`, () => {
        context(`Given there are no folders`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, [])
            })
        })

        context(`Given there are folders`, () => {
            const testFolders = { makeFoldersArray }
            const testNotes = { makeNotesArray }
            beforeEach(`insert notes & folders`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
                    .then(() => {
                        return db
                            .into('noteful_notes')
                            .insert(testNotes)
                    })
            })
            it('responds with 200 and all folders', () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, testFolders)
            })
        })
        context(`Given an XSS attack article`, () => {
            const testFolders = makeFoldersArray();
            const {maliciousNote, expectedNote} = makeMaliciousNote()
            beforeEach('insert malicious note', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
                    .then(() => {
                        return db
                        .into('noteful_notes')
                        .insert([maliciousNote])
                    })
            })
            it(`removes XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/notes`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].title).to.eql(expectedNote.title)
                        expect(res.body[0].content).to.eql(expectedNote.content)
                    })
            })
    })
})