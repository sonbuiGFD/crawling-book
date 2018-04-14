var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var cat = [
  {
    name: 'javascript',
    size: 11,
  },
  {
    name: 'java',
    size: 25,
  },
  {
    name: 'node',
    size: 2,
  },
  {
    name: 'React',
    size: 2,
  },
];
var baseurl = 'http://opencarts.org/sachlaptrinh/pdf/';

// reset file
function resetFile(path) {
  fs.writeFile(path, '', err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

cat.forEach(item => {
  resetFile(`${item.name}.txt`);
});

function saveData(data, keyword) {
  var $ = cheerio.load(data);
  var list = '';
  $('.grid-item').each(function(index, item) {
    // console.log()
    var url = $(item).find('img')[0].attribs.src;
    url = url
      .replace('http://opencarts.org/sachlaptrinh/images/', baseurl)
      .replace('.jpg', '.pdf');
    list =
      list +
      url +
      '\n' +
      $(item)
        .find('.panel-heading a')
        .text() +
      '\n';
  });
  console.log(list);
  fs.appendFile(`${keyword}.txt`, list, err => {
    if (err) throw err;
    // console.log('The "data to append" was appended to file!');
  });
}

function getPage(keyword, index) {
  var url = `http://sachlaptrinh.com/searchbooks?keyword=${keyword}&pageIndex=${index}`;
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      saveData(body, keyword);
    } else console.log('Error');
  });
}

// getPage('javascript', 1);

cat.forEach(item => {
  for (let i = 1; i <= item.size; i++) {
    (function(key, index) {
      getPage(key, index);
    })(item.name, i);
  }
});
