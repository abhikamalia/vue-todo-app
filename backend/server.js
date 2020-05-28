const express = require('express');

const config = require('./config');
const bodyParser = require('body-parser');
const mysqlDB = require('./mysqlDB');
const bcrypt = require('bcrypt');
const authRouter = require('./routes/auth');
const homeRouter = require('./routes/home');
const commonRouter = require('./routes/common');
const allTasksRouter = require('./routes/alltasks');
const completedTasksRouter = require('./routes/completedTasks');
const categoryRouter = require('./routes/category');


const app = express();

// app.use(limiter);


mysqlConnection = mysqlDB();

mysqlConnection.connect(function(err){
	if (!err) console.log('Database connected ...');
	else console.log(err);
});



app.use(bodyParser.json());


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);  
    next();
});

authRouter(app);
homeRouter(app);
commonRouter(app);
allTasksRouter(app);
completedTasksRouter(app);
categoryRouter(app);

app.listen(3000 , () => console.log('server running at port 3000'));
