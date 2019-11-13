const express = require('express')
const xss = require('xss')
const path = require('path')
const NotesService = require('./notes-service')

const NotesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    content: xss(note.content),
    modified: note.modified,
    folderId: xss(note.folderId)
})

NotesRouter
    .route('/')
    .get((req,res,next) => {
        NotesService.getAllNotes(
            req.app.get('db')
        )
        .then(notes => {
            res.json(notes)
        })
        .catch(next)
    })
    .post(jsonParser, (req,res,next) => {
        const { name, content, folder_id } = req.body
        const newNote = { name, content, folder_id }
        
        for(const [ key, value ] of Object.entries(newNote)) {
            if(value == null) {
                return res.status(404).json({
                    error: {message: `${key} is missing in request body.`}
                })
            }
        }
        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            return res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${note.id}`))
                .json(note)
        })
        .catch(next)
    })


NotesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        NotesService.getById(
            req.app.get('db'),
            req.params.note_id
        )
        .then(note => {
            if(!note) {
                return res.status(404).json({
                    error: {message: `Note not found`}
                })
            }
        res.note = note;
        next()
        })
        .catch(next)
    })
    .get((req,res,next) => {
        res.json(res.note)
    })
    .delete((req,res,next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req,res,next) => {
        const { name, content, folderId } = req.body
        noteToUpdate = { name, content, folderId }

        NotesService.noteToUpdate(
            req.app.get('*'),
            req.params.note_id,
            noteToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = NotesRouter;
