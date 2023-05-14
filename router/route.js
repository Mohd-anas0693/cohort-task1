const express = require('express');

const multer = require('multer');

const router = express.Router();

//multer.diskStorage() is function ,rewrite for unique image name
const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'img');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});


const upload = multer({ storage: storageConfig });

const db = require('../database/database');

// for displaying message of Authenction faliure in login and registration page
let msgLog = '';

let msgReg = '';

//registration page route via get request
router.get('/', function (req, res) {

    res.render('index', { msgReg: msgReg });
});


// storing data into the MongoDb via post request
router.post('/', upload.single('image'), async function (req, res) {
    //reqested data from index.ejs file from post request
    const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        file: req.file.path
    }; 

    //checking the email address entered by user there in database or not
    const checkEmail = await db.getDb().collection('users').findOne({ email: req.body.email },
        {
            _id: 1,
            name: 1,
            phone: 1,
            password: 1
        });

    //applying condition if there is no email address entered by user, then insert data into the database
    if (!checkEmail || checkEmail == 0) {
        msgReg = 'You  have Sucessfully Registered'
        const insertData = await db.getDb().collection('users').insertOne(userData);
        //return statement end the further execution of the program.
        return res.render('index', { msgReg: msgReg });
    };
    //if email adderess is there in database then reload the index page with mesReg 
    msgReg = 'Oops! This Email Account is aready registered';
    res.render('index', { msgReg: msgReg });

})
//login page route via get request

router.get('/login', function (req, res) {

    res.render('login', { msgLog: msgLog })

});

//authentication of data entered by user from database
router.post('/login', async function (req, res) {

    const checkEmail = await db.getDb().collection('users').findOne(
        {
            email: req.body.email, password: req.body.password
        },
        {
            _id: 0, name: 0, phone: 0,file:0
        });

    if (!checkEmail || checkEmail == 0) {
        msgLog = 'Password or Email  is wrong';
        return res.render('login', { msgLog: msgLog });
    }

    msgLog = ''
    res.render('user-info', { checkEmail: checkEmail });
});

module.exports = router;
