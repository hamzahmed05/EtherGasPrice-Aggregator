var express = require("express");
var router = express.Router();
var axios = require('axios')
router.use(express.json());
const mysql = require('mysql2')
const cron = require('node-cron');

// Calls getGas every 10 seconds, may need to refresh webbrowser for the function 
// to make the get request to populate database
cron.schedule('*/10 * * * * *', () => {
    getGas()
    console.log('running a task every 10 seconds');
  })


const db  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '199eight',
    database : 'node_mysql'
  })
function getGas() {
    router.get('/', async function (req,res, next) {
        let lowPrice, fastPrice, avgPrice, blockNum
        // gas prices returned are in Gwei
        
        try {
            let response = await axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&timestamp=1633112979&apikey=YourApiKeyToken")
            lowPrice = response.data.result.SafeGasPrice;
            fastPrice = response.data.result.FastGasPrice;
            avgPrice = response.data.result.ProposeGasPrice;
            blockNum = response.data.result.LastBlock;
            console.log(lowPrice, fastPrice, avgPrice, blockNum)
            let post = {fast: fastPrice, average: avgPrice, low: lowPrice, blocknum: blockNum}
            let sql = 'INSERT INTO posts SET ?';
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                console.log(result);
                res.json({"error": false, "message": {"Fast: ": fastPrice, "average: ": avgPrice, "low: ": lowPrice, "blockNum: ": blockNum}})

            })
        } catch(error){
            res.json({ "error": true, "message": "Error while fetching gas Prices"})
        }
    })

}


module.exports = router;