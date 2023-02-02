const note = require('express').Router();
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
note.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => 
        res.json(JSON.parse(data))
    );
});

// GET Route for a specific note
note.get('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        const result = json.filter((db) => db.note_id === noteId);
        return result.length > 0
            ? res.json(result)
            
    })
})

// Post Route for submitting notes
note.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in saving note');
    }
});

module.exports = note;