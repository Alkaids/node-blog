const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const multer = require('multer');
const consolidate = require('consolidate');
const mysql = require('mysql');

// express实例
const server = express();

// mysql 连接池
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'jinxin2828',
    database: 'blog'
});

// 防session劫持keys数组
const keys = [];
for (let i = 0; i < 100000; i++) {
    keys.push('key_' + Math.random());
}

// 引擎配置
server.set('view engine', 'html');
server.set('views', __dirname + '/view');
server.engine('html', consolidate.ejs);

// post解析
server.use(bodyParser.urlencoded({ extended: false }));
server.use(multer({ dest: __dirname + '/dest' }).any());

// cookie session
server.use(cookieParser('dwhdwidhwidqizn'));
server.use(cookieSession({
    name: 'sess',
    keys,
    maxAge: 20 * 60 * 1000
}));

// 用户请求
// 1.banner
server.get('/', (req, res, next) => {

    let insert = 'SELECT * FROM `banner_table`'
    db.query(insert, (err, data) => {
        if (err) {
            res.status(500).send('database error' + err).end();
        } else {
            res.banner = data;
            next();
        }
    });

});
// 2.article
server.get('/', (req, res, next) => {

    let insert = 'SELECT `title`,`sub_title`,`ID`,`banner_img` FROM `article_table`'
    db.query(insert, (err, data) => {
        if (err) {
            res.status(500).send('database error' + err).end();
        } else {
            res.article = data;
            next();
        }
    });

});
// 3.渲染
server.get('/', (req, res) => {
    res.render('index.ejs', { 
        banner: res.banner,
        article: res.article 
    });
});

// 4.详情页跳转
server.get('/article', (req, res) => {
    res.render('page.ejs', { 
        banner: res.banner,
        article: res.article 
    });
});

// 静态文件
server.use(expressStatic(__dirname + '/www'));

server.listen(9000);