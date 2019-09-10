var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

// var URL = 'https://lk.msu.ru/course/list/';
var URL = 'https://lk.msu.ru/course/list?page=2';
var results = [];

var q = tress(function (url, callback) {
    // var next_url
    // var flag
    // do {
    needle.get(url, function (err, res) {
        if (err) throw err;

        var $ = cheerio.load(res.body);

        // do {
        //     next_url = resolve(URL, $('.next>a').attr('href'))
        //     console.log(next_url)

        i = 0
        $('.pointer').each(function () {
            i++
            if (true) {
                onclick = $(this).attr('onclick')
                // console.log(onclick)
                onclick = onclick.replace(/^[^"]+"/, '')
                // console.log(onclick)
                onclick = onclick.replace(/".*$/, '')
                // console.log(onclick)
                url_course = resolve(URL, onclick)
                // console.log(url_course)
                needle.get(url_course, function (err_course, res_course) {
                    if (err_course) throw err_course;

                    var $$ = cheerio.load(res_course.body);
                    str_course = $$('.well').text()
                    // console.log(str_course)
                    str_course = str_course.replace(/ +/g, ' ')
                    list = str_course.split('\n')
                    var filteredList = list.filter(e => e !== '' && e !== ' ')
                    var length = filteredList.length
                    // console.log(length)
                    var result_list = filteredList.filter(function (value, index, arr) {
                        return index == 1 ||
                            index == 3 ||
                            index == length - 9 ||
                            index == length - 8 ||
                            index == length - 3 ||
                            index == length - 1;
                    });
                    result_list[1] = ' ' + result_list[1].substring(14);
                    result_list[2] = ' ' + result_list[2].substring(4);
                    result_list[3] = ' ' + result_list[3].substring(6);
                    // console.log(filteredList)
                    console.log(result_list)
                    results.push({
                        faculty: result_list[0],
                        lector: result_list[1]
                    })
                    console.log("-------------------------")
                });

            }
        });

        // next_url = resolve(URL, $('.next>a').attr('href'))
        // url = next_url
        // flag = !$('.next').hasClass('disabled')

        // } while (!$('.next').hasClass('disabled'))
        console.log(i);


        callback();
    });
    // } while (flag)
}, 10);

q.push(URL);

// if($('.b_infopost').contents().eq(2).text().trim().slice(0, -1) === 'Алексей Козлов'){
        //     results.push({
        //         title: $('h1').text(),
        //         date: $('.b_infopost>.date').text(),
        //         href: url,
        //         size: $('.newsbody').text().length
        //     });
        // }

        // $('.b_rewiev p>a').each(function() {
        //     q.push($(this).attr('href'));
        // });

        // $('.bpr_next>a').each(function() {
        //     q.push(resolve(URL, $(this).attr('href')));
        // });

q.drain = function(){
    fs.writeFileSync('./data.json', JSON.stringify(results));
}

