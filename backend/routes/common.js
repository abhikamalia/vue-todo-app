const config = require('../config');
const mysqlDB = require('../mysqlDB');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config();
mysqlConnection = mysqlDB();


let urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = (router) => {

    router.post('/updatetask' , urlencodedParser , (req , res) => {
        let query = 'UPDATE list SET item = ? WHERE id = ?';
        mysqlConnection.query(query , [req.body.editedTask , req.body.itemId] , function(err , rows , fields){
            if(!err) res.send(rows);
            else console.log(err);
        });
    });

    router.get('/delete/:itemId' , function(req , res){
        let queryExec1 = new Promise((resolve , reject) => {
            let query = 'DELETE FROM list WHERE id = ?';
            mysqlConnection.query(query , [req.params.itemId] , function(err , rows , fields){
                if(!err){
                    resolve(rows);
                }else console.log(err);
            });
        });
        let queryExec2 = new Promise((resolve , reject) => {
            let query = 'SELECT * FROM list';
            mysqlConnection.query(query , function(err , rows , fields){
                if(!err){
                    resolve(rows);
                }else console.log(err);
            });
        });
        Promise.all([
            queryExec1,
            queryExec2
        ]).then((rows) => {
            res.send(rows2);
        });

    //     let query = 'DELETE FROM list WHERE id = ?';
    //     mysqlConnection.query(query , [req.params.itemId] , function(err , rows , fields){
    //         if(!err){
    //             let query2 = 'SELECT * FROM list';
    //             mysqlConnection.query(query2 , function(err2 , rows2 , fields2){
    //                 if(!err2){
    //                 console.log(rows2);
    //                 res.send(rows2);
    //                 }
    //                 else{
    //                     console.log(err2);
    //                 }
    //             });
    //         }
    //         else{
    //             console.log(err);
    //         }
    //     });
    });

    router.post('/check/update' , urlencodedParser , function(req , res){
        let query = 'UPDATE list SET checkBoxCheck = ? WHERE id = ?';
        mysqlConnection.query(query , [req.body.checkboxValue , req.body.itemId] , function(err , rows , fields){
            if(!err){
                res.send(rows);
            }
            else{
                console.log(err);
            }
        });
    });
}