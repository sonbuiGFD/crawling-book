var request = require('request');
var fs = require('fs'),
  http = require('http'),
  path = require('path'),
  Q = require('q');

var baseurl = 'http://opencarts.org/sachlaptrinh/pdf/';
var cat = [
  {
    name: 'javascript',
    size: 11,
  },
];

function download(url, filepath) {
  var fileStream = fs.createWriteStream(filepath),
    deferred = Q.defer();

  fileStream
    .on('open', function() {
      http.get(url, function(res) {
        res.on('error', function(err) {
          deferred.reject(err);
        });

        res.pipe(fileStream);
      });
    })
    .on('error', function(err) {
      deferred.reject(err);
    })
    .on('finish', function() {
      deferred.resolve(filepath);
    });

  return deferred.promise;
}

function slugify(text) {
  if (text) {
    return text
      .replace('.', '-')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  } else {
    return 'notfound';
  }
}

function readfile(file, index) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err;
    downLoadFile(data.split('|'), index);
  });
}

function downLoadFile(data, index) {
  console.log(data.length);
  data.forEach((item, i) => {
    var id = item
        .split('-')[0]
        .replace('http://opencarts.org/sachlaptrinh/images/', '')
        .replace('.jpg', ''),
      name = slugify(item.split('-')[1]),
      catName = cat[index].name;
    if (item && i > 40 && i <= 60) {
      download(
        baseurl + id + '.pdf',
        __dirname + '/' + catName + '/' + name + '.pdf',
      );

      // console.log(baseurl + id + '.pdf');
      // request(baseurl + id + '.pdf')
      //   .on('error', function (err) {
      //     console.log(name)
      //     return;
      //   })
      //   .pipe(
      //     fs.createWriteStream(__dirname + '/' + catName + '/' + name + '.pdf'),
      //   );
    }
  });
}

cat.forEach((item, index) => {
  readfile(`${item.name}.txt`, index);
});
