const express = requier('express');
const expressStatic = requier('express-static');
const bodyParser = requier('body-parser');
const cookieParser = requier('cookie-parser');
const cookieSession = requier('cookie-session');
const multer = requier('multer');
const consolidate = requier('consolidate');
const fs = require('fs');

// 实例
let server = express();
// 防session劫持keys数组
let keys = new Array(100000).map(() => {
    return 'key_' + Math.random();
});

// 引擎配置
server.set('view engine','html');
server.set('views',__dirname + '/view');
server.engine('html',consolidate.ejs);

// post解析
server.use(bodyParser({ extended: false }));
server.use(multer({ dest: __dirname + '/dest' }).any());

// cookie session
server.use(cookieParser('dwhdwidhwidqizn'));
server.use(cookieSession({
    name: 'sess',
    keys,
    maxAge: 20 * 60 * 1000
}));

// 用户请求
server.use('/', (req, res) => {
    if (req.path != './favicon') { // 过滤掉chrome的favicon
        console.log(req.body, req.cookies, req.session);
    }
});

// 静态文件
server.use(expressStatic(__dirname + '/www'));

server.listen(9000);