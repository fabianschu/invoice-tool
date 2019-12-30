const { app, ipcMain, BrowserWindow } = require("electron");
var sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

//path for .db file
const dbPath = './database.db';

let mainWindow;

const createWindow = () => {
mainWindow = new BrowserWindow({
height: 768,
width: 1024,
webPreferences: {
    nodeIntegration: true
}
});
mainWindow.loadURL("http://localhost:3000");
mainWindow.on("closed", () => {
mainWindow = null;
});
};

app.on("ready", createWindow);

app.on("activate", () => mainWindow === null && createWindow());

app.on(
"window-all-closed",
() => process.platform !== "darwin" && app.quit()
);

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log("click");
    event.sender.send('asynchronous-reply', 'pong')
})

var db = new sqlite3.Database(dbPath, (err) => {
  
  if (err) {
    console.log(err.message);
  }

  console.log('Created the chinook database');

});

db.serialize(() => {
  console.log("jeha")
  // db.run('DROP TABLE IF EXISTS customers');
  db.run("CREATE TABLE IF NOT EXISTS customers(firm TEXT, name TEXT, surname TEXT, street TEXT, zip_code INTEGER, city TEXT, country TEXT)");
  db.run('INSERT INTO customers(firm, name, surname, street, zip_code, city, country) VALUES (?,?,?,?,?,?,?)', ['Hans Sparmeister GmbH', 'Sparmeister', 'Hans', 'Knausergasse 7', 73213, 'Stuttgart', 'Österreich'], function(err){
    if (err) {
      return console.log(err.message)
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  // db.run('CREATE TABLE langs(name text, age text)');
  // db.run('INSERT INTO langs(name, age) VALUES (?, ?)', ['C', 2], function(err) {
  //   if (err) {
  //     return console.log(err.message);
  //   }
  //   // get the last insert id
  //   console.log(`A row has been inserted with rowid ${this.lastID}`);
  // });
  // var stmt = db.prepare("INSERT INTO customer_addresses (x)");
  // for (var i = 0; i < 10; i++) {
  //   stmt.run("Ipsum " + i);
  // }
  // stmt.finalize();
  // let rows = [];
  // db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
  //   rows.push("Sheesh");
  // });
});
  // db.run('INSERT INTO lorem VALUES(?)', ['pipi'], (err) => console.log(err));
db.close();