const express = require('express')
const app = express();
const path = require('path');
const exjwt= require('express-jwt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res,next ) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control_Allow_Headers', 'Content-type, Authorization');
    next();
});


const PORT = 3000;
const secretKey = 'My super secret key'
const jwtMW= exjwt.expressjwt({
    secret: secretKey,
    algorithms: ['HS256']
});


let users = [
    {
        id:1,
        username: 'deepthi',
        password: '123'
    },
    {
        id:2,
        username: 'saideepthi',
        password: '12345'
    },
]

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
}) 

app.post('/api/login',(req,res)=>{
    const {username, password} = req.body;
    console.log(username,password,"  -  username,password");
    for (let user of users) {
        if(username == user.username && password == user.password){
            let token = jwt.sign({id: user.id, username: user.username}, secretKey, {expiresIn: '3m'} )
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else{
            res.status(401).json({
                success: false,
                token:null,
                err: 'Username or password is incorrect'
            })
        }
    }  

})

app.get('/api/dashboard', jwtMW, (req, res) => {
    console.log(req,"DASHBOARD REQ");
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    console.log(req,"Settings REQ");
    res.json({
        success: true,
        myContent: 'This is settings content for authenticated users!!!'
    });
});

app.use(function (err, req, res, next) {
    if (err.name === 'Unauthorized Error') {
        res.status(401).json({
            success: false,
            officialError : err,
            err: 'Username or password in incorrect 2'
        });
    }
    else {
        next(err);
    }
});

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})