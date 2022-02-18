const express = require('express')
const mysql = require('mysql2')
const port = 3000
const cron = require('node-cron');

// Creates connection to DB
const db  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '199eight',
    database : 'node_mysql'
  })
  
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected")
})
  
const app = express()
// creates DB
app.get('/createDB', (req, res) => {
  let sql = 'CREATE DATABASE node_mysql';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Database created...');
  });
});


// creates DB table
app.get('/createposttable', (req, res) => {
  let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, fast int, average int, low int, blocknum int, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('post table created...');
  });
});

// Routes for the express server

app.use('/gas',require('./routes/gas'))
app.use('/',  require('./routes/average'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;