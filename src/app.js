require('dotenv').config;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV, CLIENT_ORIGIN} = require('./config')
const FoldersRouter = require('./folders/folders-router')
const NotesRouter = require('./notes/notes-router')

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({
        origin: CLIENT_ORIGIN
    })
);


app.use('/api/folders',FoldersRouter);
app.use('/api/notes', NotesRouter);


app.use(function errorHandler(error,req,res,next) {
    let response
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server issue'}}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
})

module.exports = app;