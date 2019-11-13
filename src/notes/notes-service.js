const NotesService = {
    //get all folders from folders table
    getAllNotes(knex) {
        return knex.select('*').from('noteful_notes');
    },
    insertNote(knex, newNote) {
        return knex
            .into('noteful_notes')
            .insert(newNote)
            .returning('*')
            .then(rows => {
                return rows[0]
            })

    },
    getById(knex, id) {
        return knex
            .select('*')
            .from('noteful_notes')
            .where('id', id)
            .first()
    },
    deleteNote(knex, id) {
        return knex 
            .from('noteful_notes')
            .where({id})
            .delete()
    },
    updateNote(knex, id, newNoteFields) {
        return knex
            .from('noteful_notes')
            .where({id})
            .update(newNoteFields)
    },
}

module.exports = NotesService;