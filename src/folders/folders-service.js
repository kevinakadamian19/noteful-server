const FoldersService = {
    //get all folders from folders table
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders');
    },
    insertFolder(knex, newFolder) {
        return knex
            .into('noteful_folders')
            .insert(newFolder)
            .returning('*')
            .then(rows => {
                return rows[0]
            })

    },
    getById(knex, id) {
        return knex
            .select('*')
            .from('noteful_folders')
            .where('id', id)
            .first()
    },
    deleteFolder(knex, id) {
        return knex 
            .from('noteful_folders')
            .where({id})
            .delete()
    },
    updateFolder(knex, id, newFolderFields) {
        return knex
            .from('noteful_folders')
            .where({id})
            .update(newFolderFields)
    },
}

module.exports = FoldersService;