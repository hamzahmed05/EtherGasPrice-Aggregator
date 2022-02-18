var express = require("express");
var router = express.Router();
var axios = require('axios')
router.use(express.json());
const mysql = require('mysql2')
//creates connection to DB
const db  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '199eight',
    database : 'node_mysql'
})

// route to get average
router.get("/average", async function(req,res, next) {
    fromTime = req.query.fromTime;
    toTime = req.query.toTime;
    if(isNaN(fromTime) || isNaN(toTime)) {
        res.send("incorrect input")
    } else {
        let sql = `SELECT floor(sum(average)/count(*)) as total FROM posts where UNIX_TIMESTAMP(timestamp) >= ${fromTime} AND UNIX_TIMESTAMP(timestamp) <= ${toTime}`
        // accesses DB with the parameters inputted
        let query = db.query(sql, (err, result) => {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                // if timestamps were invalid, hence were not in database
                if (!row.total) {
                    console.log("error")
                    res.json({ "error": true, "message": "Error while fetching gas Prices. Data may not exist in Database"})
                }
                // returns a successful call for the given parameter
                else {
                    value = row.total
                    console.log(row.total)
                    res.json({"error": false, "message": {"average": value, "fromTime": fromTime, "toTime": toTime}});
                }
            }) 
        })
        }
    })







module.exports = router;
