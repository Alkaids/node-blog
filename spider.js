const request = require('request');
const cheerio = require('cheerio');

const targetUrl = 'https://m.hupu.com/';

let getNewsList = (func) => {
    request(targetUrl, (err, res) => {

        let banner = [];
        let news = [];

        if (err) return console.error(err);

        let $ = cheerio.load(res.body.toString());
        // banner 部分
        let figures = $('body').find('.swipe-wrap').find('figure');
        for (let i = 0; i < figures.length; i++) {
            let title = decodeURI($(figures[i]).find('.swipe-title').text());
            let src;
            if ($(figures[i]).find('.image').css('background-image')) {
                src = String($(figures[i]).find('.image').css('background-image')).replace('url(', '').replace(')', '');
            } else {
                src = String($(figures[i]).find('.image').attr('data-src')).replace('url(', '').replace(')', '');
            }
            banner[i] = { "title": title, "imgUrl": src }
        }

        // news部分
        let sections = $('body').find('.home-diy').find('section');
        for (let i = 0; i < sections.length; i++) {
            let title = decodeURI($(sections[i]).find('.title').html());
            let src = String($(sections[i]).find('.pic').css('background-image')).replace('url(', '').replace(')', '');
            let detailUrl = escape($(sections[i]).find('a').attr('href'));
            news[i] = { "title": title, "imgUrl": src, "detailUrl": detailUrl }
        }

        func(banner, news);
    });
}

let getNewsDetail = (url, func) => {
    request(url, (err, res) => {

        if (err) return console.error(err);

        let $ = cheerio.load(res.body.toString());

        let content = $('body').find('.article-content').html();
        let title = $('body').find('.headline').text();
        let times = $('body').find('.artical-info').find('.times').text();

        func({
            title,
            times,
            content
        });
    });
}
module.exports = { getNewsList, getNewsDetail }