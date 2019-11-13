const express = require('express')
const xss = require('xss')
const path = require('path')
const FoldersService = require('./folders-service')

const FoldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name),
    folderId: xss(folder.folderId)
})

FoldersRouter
    .route('/')
    .get((req,res,next) => {
        FoldersService.getAllFolders(
            req.app.get('db')
        )
        .then(folders => {
            res.json(folders)
        })
        .catch(next)
    })
    .post(jsonParser, (req,res,next) => {
        const { name } = req.body
        const folderId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const newFolder = { name, folderId }
        
        if(!newFolder) {
            return res.status(400).json({
                error: {message: `Name is required to add new folder`}
            })
        }
        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
        .then(folder => {
            return res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${folder.id}`))
                .json(folder)
        })
        .catch(next)
    })


FoldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        FoldersService.getById(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(folder => {
            if(!folder) {
                return res.status(404).json({
                    error: {message: `Folder not found`}
                })
            }
        res.folder = folder;
        next()
        })
        .catch(next)
    })
    .get((req,res,next) => {
        res.json(serializeFolder(res.folder))
    })
    .delete((req,res,next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req,res,next) => {
        const { name } = req.body
        folderToUpdate = { name }

        FoldersService.folderToUpdate(
            req.app.get('*'),
            req.params.folder_id,
            folderToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = FoldersRouter;
