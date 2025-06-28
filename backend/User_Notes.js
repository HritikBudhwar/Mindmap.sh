const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
    usernameNote: {
        type: String,
        required: true, 
    },
    note: {
        type: String,

    },

});



module.exports = mongoose.model('Note', NoteSchema);
