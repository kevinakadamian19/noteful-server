function makeNotesArray() {
    return [
        { 
            id: 1,
            name: 'Superb',
            note_id: '123A56',
            content: 'Hello!',
            modified: '2019-01-03 00:00:00',
            folder_id: 2,
        },
        {
            id: 2,
            name: 'Cowboy Bebop',
            note_id: '6543b1',
            content: 'Best anime ever',
            modified: '2018-03-01 00:00:00',
            folder_id: 1,
        },
        {
            id: 3,
            name: 'Shonen Jump',
            note_id: '2987Lp',
            content: 'Hero ends up being orange',
            modified: '2018-05-16 23:00:00',
            folder_id: 3,
        },
    ]
}

function makeMaliciousNote() {
    const maliciousNote = {
        id: 911,
        name: 'How-to',
        modified: new Date().toISOString,
        note_id: 'Naughty Naughty very naughty <script>alert("xss");</script>',
        folder_id: 2,
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedNote = {
        ...maliciousNote,
        note_id: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/scripts&gt;',
        content: `Bade image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousArticle,
        expectedArticle
    }
}

module.exports = { makeNotesArray, makeMaliciousNote };