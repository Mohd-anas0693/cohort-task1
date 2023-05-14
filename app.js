const path= require('path');

const multer=require('multer');


const express= require('express');

const db= require('./database/database');

const userRoutes= require('./router/route')

const app=express();

app.set('view engine' ,'ejs');
app.set('views' ,path.join(__dirname,'views'));

app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use('/img',express.static('img'));
app.use(userRoutes);

db.connectToDatabase().then(
    function(){
        app.listen(3000);
    }
)

