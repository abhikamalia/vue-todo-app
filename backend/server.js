
const express = require('express');

const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');


const app = express();



let mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'abhi@123',
	database: 'todo_db'

});


mysqlConnection.connect(function(err){
	if (!err) console.log('Database connected ...');
	else console.log(err);
});



app.use(bodyParser.json());
let urlencodedParser = bodyParser.urlencoded({extended : false});



app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);  
    next();
});


let sessionUser = '';
app.get('/' , function(req , res){
    if(sessionUser == ''){
        res.send('no_user');
        
    }
    else{
        
        let query2 = "SELECT DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') as date1";
            mysqlConnection.query(query2 , function(err2 , rows2 , fields2){
               if(!err2){
                    let query3 = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date2";
                    mysqlConnection.query(query3 , function(err3 , rows3 , fields3){
                        if(!err3){
                            console.log('inside');
                            let query = 'SELECT * FROM list WHERE user = ? and  date = ?';
                            mysqlConnection.query(query ,[sessionUser , rows2[0].date1 ],  function(err , rows , fields){
                                if(!err){
                                    console.log(rows2[0] , rows3[0]);
                                    res.send({rows: rows , user: sessionUser , today: rows3[0]});
                                }
                                else{
                                    console.log(err)
                                }
                            });
                        }
                        else{
                            console.log(err3)
                        }
                    });
                }
                else{
                    console.log(err2);
                }
           
        });
        // res.send(sessionUser);
    }
});


app.post('/add' , urlencodedParser , function(req , res){
    console.log(req.body);
    let query = 'INSERT INTO list(item , date , user , category , checkBoxCheck) VALUES(? , ? , ? , ? , ?)';
    mysqlConnection.query(query , [req.body.name , req.body.date , req.body.user , req.body.category , false] , function(err , rows , fields){
        if(err) throw err;
        console.log(rows);
        res.send(rows);
    });
   
});

app.post('/edit/:itemId' , urlencodedParser , function(req , res){
    let query = 'UPDATE list SET item = ? WHERE id = ?';
    mysqlConnection.query(query , [req.body.editedItem , req.params.itemId] , function(err , rows , fields){
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    });
});

app.get('/completedtasks' , function(req , res){
    if(sessionUser == ''){
        res.send('no_user');
    }
    else{
        let query = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
        mysqlConnection.query(query , function(err , rows , fields2){
               if(!err){

                    let query2 = 'SELECT * FROM list where user = ? and checkBoxCheck = 1 ';
                    mysqlConnection.query(query2 , [sessionUser] , function(err2 , rows2 , fields2){
                        if(!err2){
                            res.send({rows: rows2 , today: rows[0]});
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

app.post('/check/update' , urlencodedParser , function(req , res){
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

app.get('/alltasks' , function(req , res){
    if(sessionUser == ''){
        res.send('no_user');
    }
    else{
        let query = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
        mysqlConnection.query(query , function(err , rows , fields2){
               if(!err){

                    let query2 = 'SELECT * FROM list where user = ?';
                    mysqlConnection.query(query2 , [sessionUser] , function(err2 , rows2 , fields2){
                        if(!err2){
                            res.send({rows: rows2 , today: rows[0]});
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


app.get('/all/:category' , function(req , res){
    if(sessionUser == ''){
        res.send('no_user');
    }
    else{
        let query = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date";
        mysqlConnection.query(query , function(err , rows , fields2){
               if(!err){

                    let query2 = "SELECT * FROM list where user = ? and category = ?";
                    mysqlConnection.query(query2 , [sessionUser , req.params.category] , function(err2 , rows2 , fields2){
                        if(!err){
                            res.send({rows: rows2 , today: rows[0]});
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

app.get('/category/:category' , function(req , res){
    if(sessionUser == ''){
        res.send('no_user');
        
    }
    else{
        
        let query2 = "SELECT DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') as date1";
            mysqlConnection.query(query2 , function(err2 , rows2 , fields2){
               if(!err2){
                    let query3 = "SELECT DATE_FORMAT(CURRENT_DATE, '%W %D %M %Y') as date2";
                    mysqlConnection.query(query3 , function(err3 , rows3 , fields3){
                        if(!err3){
                            console.log('inside');
                            let query = "SELECT * FROM list WHERE user = ? and  date = ? and category = ?";
                            mysqlConnection.query(query ,[sessionUser , rows2[0].date1 , req.params.category],  function(err , rows , fields){
                                if(!err){
                                    console.log(rows2[0] , rows3[0]);
                                    res.send({rows: rows , user: sessionUser , today: rows3[0]});
                                }
                                else{
                                    console.log(err)
                                }
                            });
                        }
                        else{
                            console.log(err3)
                        }
                    });
                }
                else{
                    console.log(err2);
                }
           
        });
        // res.send(sessionUser);
    }
});

app.get('/delete/:itemId' , function(req , res){
    let query = 'DELETE FROM list WHERE id = ?';
    mysqlConnection.query(query , [req.params.itemId] , function(err , rows , fields){
        if(!err){
           let query2 = 'SELECT * FROM list';
           mysqlConnection.query(query2 , function(err2 , rows2 , fields2){
              if(!err2){
                console.log(rows2);
                res.send(rows2);
              }
              else{
                  console.log(err2);
              }
           });
        }
        else{
            console.log(err);
        }
    });
});


app.get('/register' , function(req , res){
    if(sessionUser !== ''){
        res.send(sessionUser);
    }
    else{
        res.send('no_user');
    }
});
app.post('/register' , urlencodedParser , async function(req , res){
    
        console.log(req.body);
        if(req.body.password === req.body.confirmpassword){
            const hashedPassword = await bcrypt.hash(req.body.password , 10)
            let query = 'INSERT INTO user(email , password) VALUES(? , ?)';
            mysqlConnection.query(query , [req.body.email , hashedPassword] , function(err , rows , fields){
                if(!err){
                    sessionUser = req.body.email;
                    console.log(rows);
                    res.send({message: 'success' , user: sessionUser});
                }
                else{
                    res.send('error');
                }
            });
        }else{
            res.send("Passwords don't match...Try again");
        }
        
   
});


app.get('/login' , function(req , res){
    if(sessionUser !== ''){
        res.send(sessionUser);
    }
    else{
        res.send('no_user');
    }
});

app.post('/login' , urlencodedParser ,  function(req , res){
    console.log(req.body);
    let check = false;
    let query = 'SELECT * FROM user';
    mysqlConnection.query(query , async function(err , rows , fields){
        if(!err){
            for(let i = 0 ; i < rows.length ; i++){
                if(rows[i].email == req.body.email){
                    console.log('email;')
                    if(await bcrypt.compare(req.body.password , rows[i].password)){
                        console.log('found email');
                        sessionUser = req.body.email;
                        check = true;
                        res.send({message: 'success' , user:  sessionUser});
                        break;
                    }
                    
                }
               
            }
            if(!check){
                console.log('error login');
                res.send('error');
            }
        }
    });
});

app.get('/logout' , function(req , res){
    sessionUser = '';
    res.send(sessionUser);
});

// app.post('/login' , urlencodedParser, passport.authenticate('local' , {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }));


// function checkAuthenticated(req , res , next){
//     if(req.isAuthenticated()){
//         return next()
//     }
// }

app.listen(3000 , () => console.log('server running at port 3000'));