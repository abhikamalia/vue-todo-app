const config = require('../config');
const mysqlDB = require('../mysqlDB');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const util = require('util');


const limiter = rateLimit({
    windowMs: 30 * 1000, // 60 * 100 = 1 minute so its 15 mins
    max: 20,
    message: 'Limit exceeded..',
    headers: true
    
});

dotenv.config();
mysqlConnection = mysqlDB();


let urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = (router) => {



    router.get('/' , limiter , function(req , res){
        
        if(!config.token){
            res.send({message: 'no_user'});
                
        }
        else{
            
            const verified = jwt.verify(config.token , process.env.TOKEN_SECRET);
            req.user = verified;
            //promises
            let queryExec1 = new Promise((resolve , reject) => {
                let query1 = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date1";
                mysqlConnection.query(query1 , function(err1 , rows1 , fields1){
                    if(!err1){
                        resolve(rows1);
                    }
                    else console.log(err1);
                }); 
            });
            let queryExec2 = new Promise((resolve , reject) => {
                let query2 = "SELECT * FROM list WHERE user = ? and  date = DATE_FORMAT(CURRENT_DATE , '%Y-%m-%d')";
                mysqlConnection.query(query2 , [req.user.id] , function(err2 , rows2 , fields2){
                    if(!err2){
                        resolve(rows2);
                    }
                    else console.log(err2);
                }); 
            });
            Promise.all([
                queryExec1,
                queryExec2
            ]).then((rows) => {
                console.log(rows);

                res.send({rows: rows[1] , user: req.user.id , today: rows[0][0].date1, message: 'logged_in'});
                
            });
            // let query2 = "SELECT DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') as date1";
            //     mysqlConnection.query(query2 , function(err2 , rows2 , fields2){
            //         if(!err2){
            //             let query3 = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date2";
            //             mysqlConnection.query(query3 , function(err3 , rows3 , fields3){
            //                 if(!err3){
            //                     console.log('inside');
            //                     let query = 'SELECT * FROM list WHERE user = ? and  date = ?';
            //                     mysqlConnection.query(query ,[req.user.id , rows2[0].date1 ],  function(err , rows , fields){
            //                         if(!err){
            //                             console.log(rows2[0] , rows3[0]);
            //                             res.send({rows: rows , user: req.user.id , today: rows3[0] , message: 'logged_in'});
            //                         }
            //                         else{
            //                             console.log(err)
            //                         }
            //                     });
            //                 }
            //                 else{
            //                     console.log(err3)
            //                 }
            //             });
            //         }
            //         else{
            //             console.log(err2);
            //         }
                
            // });
            
        }
    });

    router.post('/add' , urlencodedParser , (req , res) => {

        console.log(req.body);
        let query = 'INSERT INTO list(item , date , user , category , checkBoxCheck) VALUES(? , ? , ? , ? , ?)';
        mysqlConnection.query(query , [req.body.name , req.body.date , req.body.user , req.body.category , false] , function(err , rows , fields){
            if(err) throw err;
            console.log(rows);
            res.send(rows);
        });
           
    });
        
}
