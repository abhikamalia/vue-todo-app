const config = require('../config');
const mysqlDB = require('../mysqlDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { registerValidation , loginValidation } = require('../validation');

dotenv.config();
mysqlConnection = mysqlDB();


let urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = (router) => {

    router.get('/login' , (req , res) => {
        if(config.token){
            const verified = jwt.verify(config.token , process.env.TOKEN_SECRET);
            req.user = verified;
            res.send({message: 'logged_in' , user: req.user , token: config.token});
        }
        else{
            res.send({message: 'no_user'});
        }
    });

    router.get('/register' , (req , res) => {
        if(config.token){
            const verified = jwt.verify(config.token , process.env.TOKEN_SECRET);
            req.user = verified;
            res.send({message: 'logged_in' , user: req.user , token: config.token});
        }
        else{
            res.send({message: 'no_user'});
        }
    });


    router.post('/login' , urlencodedParser , (req , res) => {
        console.log(req.body);
        const { error } = loginValidation(req.body);
        if(error) return res.send({message: error.details[0].message});

        let query = 'SELECT * FROM user';
        mysqlConnection.query(query , async (err , rows , fields) => {
            if(!err){
                let emailExist = false;
                for(let i = 0 ; i < rows.length ; i++){
                    if(rows[i].email == req.body.email){
                        emailExist = true;
                        const validPassword = await bcrypt.compare(req.body.password , rows[i].password);
                        if(!validPassword) return res.send({message: 'Wrong Password...'});
                            // res.send('logged in !');
                        let token = jwt.sign({id: rows[i].email} , process.env.TOKEN_SECRET);
                        res.header('auth-token' , token);
                        config.token = token;
                        const verified = jwt.verify(token , process.env.TOKEN_SECRET);
                        req.user = verified;
                        res.send({user: req.user.id , token: token , message: 'logged_in'});
                        
                    }
                }
            
                if(!emailExist){
                    return res.send({message: 'Email does not exist'});
                }
            }
            else{
                console.log(err);
            }
        });    
    });


    router.post('/register' , urlencodedParser , (req , res) => {
        console.log(req.body);
        const { error } = registerValidation(req.body);
        if(error) return res.send({message: error.details[0].message});

        let query = 'SELECT * FROM user';
        mysqlConnection.query(query , async (err , rows , fields) => {
            if(!err){
                let emailExist = false;
                for(let i = 0 ; i < rows.length ; i++){
                    if(rows[i].email == req.body.email){
                        emailExist = true;
                        return res.send({message: 'Email already exist'});
                    }
                }
                if(!emailExist){
                    if(req.body.password == req.body.confirmpassword){
                        try{
                            //encrypt password by adding a salt
                            const salt = await bcrypt.genSalt(10);
                            const hashedPassword = await bcrypt.hash(req.body.password , salt);
                            let query2 = 'INSERT INTO user(email , password) VALUES(? , ?)';
                            mysqlConnection.query(query2 , [req.body.email , hashedPassword] , (err22 , rows2 , fields2) => {
                                if(!err) {
                                    token = jwt.sign({id: req.body.email} , process.env.TOKEN_SECRET);
                                    // res.header('auth-token' , token);
                                    config.token = token;

                                    // console.log(res.headers);
                                    const verified = jwt.verify(token , process.env.TOKEN_SECRET);
                                    req.user = verified;
                                    res.send({user: req.user.id , token: token , message: 'logged_in'});
                                    
                                }
                                else console.log(err);
                            });
                        }catch{
                            res.status(400).send(err);
                        }
                    }
                    else{
                        res.send({message: 'passwords dont match'});
                    }
                    
                }
                console.log('working...');
            }
        });
    });

    router.get('/logout' , (req , res) => {
        config.token = '';
        req.user = '';
        res.send({user: req.user})
    });
}
