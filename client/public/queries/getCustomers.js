var sqlite3 = require('sqlite3').verbose();

const dbPath = './database.db';
let sql = 'SELECT * FROM customers';

var db = new sqlite3.Database(dbPath, (err) => {

    if (err) {
        console.log(err.message);
    }

    console.log('Created the chinook database');

});

const getCustomers = () => {
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
}

getCustomers();

db.close();