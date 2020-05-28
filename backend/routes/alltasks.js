const config = require('../config');
const mysqlDB = require('../mysqlDB');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const util = require('util');


dotenv.config();
mysqlConnection = mysqlDB();


let urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = (router) => {

    
router.get('/alltasks' , function(req , res){
    if(!config.token){
        res.send({message: 'no_user'});
            
    }
    else{
        console.log('okay');
        const verified = jwt.verify(config.token , process.env.TOKEN_SECRET);
        req.user = verified;
        //promise
        let queryExec1 = new Promise((resolve , reject) => {
            let query1 = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
            mysqlConnection.query(query1 , function(err1 , rows1 , fields1){
                if(!err1){
                    resolve(rows1);
                }else console.log(err1);
            });
        });
        let queryExec2 = new Promise((resolve , reject) => {
            let query2 = 'SELECT * FROM list where user = ?';
            mysqlConnection.query(query2 , [req.user.id] , function(err2 , rows2 , fields2){
                if(!err2){
                    resolve(rows2);
                }else console.log(err2);
            });
        });

        Promise.all([
            queryExec1,
            queryExec2
        ]).then((rows) => {
            console.log(rows[0][0].date);

            res.send({rows: rows[1] , user: req.user.id , today: rows[0][0].date});
            
        });

        // let query = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
        // mysqlConnection.query(query , function(err , rows , fields2){
        //        if(!err){

        //             let query2 = 'SELECT * FROM list where user = ?';
        //             mysqlConnection.query(query2 , [req.user.id] , function(err2 , rows2 , fields2){
        //                 if(!err2){
                            
        //                     res.send({rows: rows2 , user: req.user.id , today: rows[0]});
        //                 }
        //                 else{
        //                     res.send('error');
        //                 }
        //             });
        //        }
        //        else{
        //            console.log(err);
            
        //        }
        // });
    }
});


}