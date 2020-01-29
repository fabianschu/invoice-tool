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
      webSecurity: false,
      nodeIntegration: true
  }
  });
  mainWindow.loadURL("http://localhost:3000/test");
  mainWindow.on("closed", () => {
  mainWindow = null;
  });
};

app.on('ready', () => {
  /// #if env == 'DEBUG'
  console.log('Initialize Application')
  /// #endif

  createWindow();
})

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
    firstName TEXT, 
    lastName TEXT, 
    street TEXT, 
    zip INTEGER, 
    city TEXT, 
    country TEXT)`);
  db.run(`INSERT INTO customers(
    firm, 
    firstName, 
    lastName, 
    street, 
    zip, 
    city, 
    country) 
  VALUES (?,?,?,?,?,?,?)`, [
    'Wurst GmbH', 
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

ipcMain.on('read', (event, arg) => {
  db.all(`${arg}`, [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(rows);
    event.sender.send('asynchronous-reply', rows)
  });
});


ipcMain.on('update', (event, arg) => {
  console.log('printi: ', arg);
  db.serialize(() => {
    db.run(arg[0], arg[1], (err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
      if (err) {
          throw err;
      }
      console.log(rows);
      //results are send to the renderer, but not the event emitter
      mainWindow.webContents.send( 'asynchronous-reply', rows );
    });
  })
})

ipcMain.on('delete', (event, arg) => {
  console.log('printi: ', arg);
  db.serialize(() => {
    db.run(arg[0], arg[1], (err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
      if (err) {
          throw err;
      }
      //console.log(rows);
      //results are send to the renderer, but not the event emitter
      mainWindow.webContents.send( 'asynchronous-reply', rows );
    });
  })
})

ipcMain.on('create', (event, arg) => {
  console.log('printi: ', arg);
  db.serialize(() => {
    db.run(arg[0], arg[1], (err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
      if (err) {
          throw err;
      }
      console.log(rows);
      console.log(rows[rows.length-1].id);
      //results are send to the renderer, but not the event emitter
      mainWindow.webContents.send( 'customer-creation', rows );
    });
  })
})

ipcMain.on('print', (event, arg) => {
    // let win = new BrowserWindow({
    //    width: 768, 
    //    height: 1024,
    //    webPreferences: {
    //     webSecurity: false,
    //   nodeIntegration: true
    // }
    // })
    // win.loadURL('http://localhost:3000/')
    
    // win.webContents.on('did-finish-load', () => {
    // // Use default printing options
    //     win.webContents.printToPDF({})
    //       .then(data => {
    //         //console.log(data);
    //         fs.writeFile('./print.pdf', data, (error) => {
    //             if (error) throw error
    //             console.log('Write PDF successfully.')
    //         })
    //       })
    //       .catch(error => {console.log(error)})
    // })
    mainWindow.webContents.printToPDF({})
          .then(data => {
            //console.log(data);
            fs.writeFile('./print.pdf', data, (error) => {
                if (error) throw error
                console.log('Write PDF successfully.')
            })
          })
          .catch(error => {console.log(error)})
})
 
//db.close();
