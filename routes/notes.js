const note = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
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
        const result = json.filter((db) => db.id === noteId);
        return result.length > 0
            ? res.json(result)
            : res.json('No tip with that ID');
    });
});

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
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');

        res.json('Note saved succesfully!');
    } else {
        res.json('Error in saving note');
    }
});

// DELETE Route for a specific Note
note.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all Notes except the one with the ID provided in the URL
        const result = json.filter((db) => db.id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Note ${noteId} has been deleted`);
      });
  });

module.exports = note;