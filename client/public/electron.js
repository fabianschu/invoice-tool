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
    country TEXT,
    rate INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS positions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_invoice INTEGER, 
    project TEXT, 
    description TEXT, 
    hours TEXT,
    price INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS invoices(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_customer INTEGER, 
    title1 TEXT,
    title2 TEXT,
    invoiceNumber INTEGER,
    paid INTEGER DEFAULT 0
    )`);
  db.run(`INSERT INTO customers(
    firm, 
    firstName, 
    lastName, 
    street, 
    zip, 
    city, 
    country,
    rate) 
  VALUES (?,?,?,?,?,?,?,?)`, [
    'Wurst GmbH', 
    'Sparmeister', 
    'Hans', 
    'Knausergasse 7', 
    73213, 
    'Stuttgart', 
    'Österreich',
    45], (err) => {
      if (err) {
        return console.log(err.message)
      }
    });
});

ipcMain.on('initialize-customers', (event, arg) => {
  db.all(`${arg}`, [], (err, rows) => {
    if (err) {
        throw err;
    }
    event.sender.send('customers-initialized', rows)
  });
});


ipcMain.on('update-customer', (event, arg) => {
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
      mainWindow.webContents.send( 'customers-initialized', rows );
    });
  })
})

ipcMain.on('delete-customer', (event, arg) => {
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
      mainWindow.webContents.send( 'customers-initialized', rows );
    });
  })
})

ipcMain.on('create-customer', (event, arg) => {
  console.log('event: ', event);
  console.log('arg: ', arg);
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
      mainWindow.webContents.send( 'customer-created', rows );
    });
  })
});

ipcMain.on('create-invoice', (event, arg) => {
  console.log('create-invoice: ', arg);
  let currentCustomer = arg[1][0];
  console.log(currentCustomer);
  db.serialize(() => {
    let currentInvoiceNumber;
    let data = [...arg[1]];

    db.all(`SELECT MAX(invoiceNumber) FROM invoices;`, [], (err, rows) => {
      if (err) {
          throw err;
      }
      let tmp = Object.values(rows[0])[0];
      currentInvoiceNumber = tmp + 1;
      data[3] = currentInvoiceNumber;

      db.run(arg[0], data, (err) => {
        if (err) {
          return console.error(err.message);
        }
      });

    });

    db.all(`SELECT * FROM invoices WHERE fk_customer = ?;`, currentCustomer, (err, rows) => {

      if (err) {
          throw err;
      }
      console.log('querying');
      console.log('providing invoices: ', rows);
      event.reply('invoice-created', rows);
    });
  })
});

ipcMain.on('create-position', (event, arg) => {
  console.log('create position for invoice: ', arg);
  let invoiceId = arg[1][0];
  console.log(invoiceId);
  db.serialize(() => {
    db.run(arg[0], arg[1], (err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    db.all(`SELECT * FROM positions WHERE fk_invoice = ?`, invoiceId, (err, rows) => {
      if (err) {
          throw err;
      }
      console.log('position created: ', rows);
      mainWindow.webContents.send( 'position-read', rows );
    });
  })
})

ipcMain.on('read-position', (event, arg) => {
  console.log(arg);
  db.all(arg[0], arg[1], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log('positions read: ', rows);
    mainWindow.webContents.send( 'position-read', rows );
  });
})

ipcMain.on('update-position', (event, arg) => {
  console.log(arg);
  let id = arg[1][1];
  db.serialize(() => {
    db.run(arg[0], arg[1], (err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    db.all(`SELECT * FROM positions WHERE id = ?`, id, (err, rows) => {
      if (err) {
          throw err;
      }
      console.log(rows);
      //results are send to the renderer, but not the event emitter
      mainWindow.webContents.send( 'position-updated', rows );
    });
  })
})

ipcMain.on('read-invoice', (event, arg) => {
  console.log('read-invoice: ',arg);
  // let id = arg[1][1];
  // db.serialize(() => {
  //   db.run(arg[0], arg[1], (err) => {
  //     if (err) {
  //       return console.error(err.message);
  //     }
  //   });
    db.all(arg[0], arg[1], (err, rows) => {
      if (err) {
          throw err;
      }
      console.log('read-invoice: ', rows);
      mainWindow.webContents.send( 'invoice-read', rows );
    });
  // })
})

ipcMain.on('delete-position', (event, arg) => {

  db.serialize(() => {
    const {position_id, invoice_id} = arg[1];
    db.run('DELETE FROM positions WHERE id=?', position_id, (err) => {
      if (err) {
        return console.error(err.message);
      }
    });
    //check positions of that specific invoice
    db.all(`SELECT ALL * FROM positions WHERE fk_invoice = ?`, invoice_id, (err, rows) => {
      if (err) {
          throw err;
      }
      console.log('positions read: ', rows);
      mainWindow.webContents.send( 'position-read', rows );
    });
  })
})


ipcMain.on('print', (event, arg) => {
    mainWindow.webContents.printToPDF({
      printBackground: true
    })
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
