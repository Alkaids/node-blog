const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const multer = require('multer');
const consolidate = require('consolidate');
const { getNewsList, getNewsDetail } = require('./libs/spider');
const tools = require('./libs/comment');

// express实例
const server = express();

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
// 首页
server.get('/', (req, res) => {
    getNewsList((banner, article) => {
        res.render('index.ejs', {
            banner,
            article
        });
    });
});

// 详情
server.get('/article', (req, res) => {

    if (req.query.id) {
        getNewsDetail(req.query.id, (article) => {
            res.render('page.ejs', {
                article_data: article
            });
        });
    } else {
        res.status(404).send('文章找不到').end();
    }
});

// 静态文件
server.use(expressStatic(__dirname + '/www'));

server.listen(9000);

console.log('server listening at http://localhost:9000');

module.exports = server;