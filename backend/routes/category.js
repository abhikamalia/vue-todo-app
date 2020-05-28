const config = require('../config');
const mysqlDB = require('../mysqlDB');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config();
mysqlConnection = mysqlDB();


let urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = (router) => {

    router.get('/category/:category' , function(req , res){
        if(!config.token){
            res.send({message: 'no_user'});
                
        }
        else{
            const verified = jwt.verify(config.token , process.env.TOKEN_SECRET);
            req.user = verified;

            //promise
            let queryExec1 = new Promise((resolve , reject) => {
                let query = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
                mysqlConnection.query(query , function(err , rows , fields){
                    if(!err){
                        resolve(rows);
                    }else console.log(err);
                });
            });
            let queryExec2 = new Promise((resolve , reject) => {
                let query = "SELECT * FROM list WHERE user = ? and  date = DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') and category = ?";
                mysqlConnection.query(query , [req.user.id , req.params.category] , function(err , rows , fields){
                    if(!err){
                        resolve(rows);
                    }else console.log(err)
                });
            });
            Promise.all([
                queryExec1,
                queryExec2
            ]).then((rows) => {
                res.send({rows: rows[1] , user: req.user.id , today: rows[0][0].date});
            });

            // let query2 = "SELECT DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') as date1";
            //     mysqlConnection.query(query2 , function(err2 , rows2 , fields2){
            //         if(!err2){
            //             let query3 = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date2";
            //             mysqlConnection.query(query3 , function(err3 , rows3 , fields3){
            //                 if(!err3){
            //                     console.log('inside');
            //                     let query = "SELECT * FROM list WHERE user = ? and  date = ? and category = ?";
            //                     mysqlConnection.query(query ,[req.user.id , rows2[0].date1 , req.params.category],  function(err , rows , fields){
            //                         if(!err){
            //                             console.log(rows2[0] , rows3[0]);
            //                             res.send({rows: rows , user: req.user.id , today: rows3[0]});
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
    
    
    router.get('/all/:category' , function(req , res){
        if(!config.token){
            res.send({message: 'no_user'});
                
        }
        else{
            const verified = jwt.verify(config.token , process.env.TOKEN_SECRET);
            req.user = verified;
            let query = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
            mysqlConnection.query(query , function(err , rows , fields2){
                if(!err){

                        let query2 = "SELECT * FROM list where user = ? and category = ?";
                        mysqlConnection.query(query2 , [req.user.id , req.params.category] , function(err2 , rows2 , fields2){
                            if(!err){
                                res.send({rows: rows2 , user: req.user.id ,  today: rows[0]});
                            }
                            else{
                                res.send('error');
                            }
                        });
                }
                else{
                    console.log(err);
                
                }
            });
        }
    });


}