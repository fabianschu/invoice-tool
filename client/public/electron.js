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


var db = new sqlite3.Database(dbPath, (err) => {
  
  if (err) {
    console.log(err.message);
  }
  
  console.log('Created the chinook database');
  
});


db.serialize(() => {
  console.log("jeha")
  // db.run('DROP TABLE IF EXISTS customers');
  db.run(`CREATE TABLE IF NOT EXISTS customers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firm TEXT, 
    name TEXT, 
    surname TEXT, 
    street TEXT, 
    zip_code INTEGER, 
    city TEXT, 
    country TEXT)`);
  db.run(`INSERT INTO customers(
    firm, 
    name, 
    surname, 
    street, 
    zip_code, 
    city, 
    country) 
  VALUES (?,?,?,?,?,?,?)`, [
    'Hans Sparmeister GmbH', 
    'Sparmeister', 
    'Hans', 
    'Knausergasse 7', 
    73213, 
    'Stuttgart', 
    'Österreich'], (err) => {
      if (err) {
        return console.log(err.message)
      }
    });
});

ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg === "retrieve-customers") {
      db.all('SELECT * FROM customers', [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        event.sender.send('asynchronous-reply', rows)
    });
  }
})


//db.close();