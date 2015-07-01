// Generated by CoffeeScript 1.4.0
(function() {
  var fs, list, listips, sysPath, toHTML, weinre;

  sysPath = require("path");

  fs = require("fs");

  list = function(klass, links, pathname) {
    var link;
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        _results.push("<a class='" + klass + "' href='" + (sysPath.join(pathname, link)) + "'>" + link + "</a>");
      }
      return _results;
    })()).join("\n");
  };

  weinre = function(inspect) {
    if (inspect) {
      return "<div class=\"weinre\" >\n  <a class=\"u-ebtn\" id='weinre' href='#' target='_blank'>nav to weinre terminal</a>\n</div>";
    } else {
      return "";
    }
  };

  listips = function(ips, port) {
    var ip, url, _i, _len;
    url = "";
    for (_i = 0, _len = ips.length; _i < _len; _i++) {
      ip = ips[_i];
      url += "<li><a href='http://" + ip + ":" + port + "'>" + ip + ":" + port + "</a></li>";
    }
    return url;
  };

  toHTML = function(files, folders, pathname, options) {
    var prelink, prevpath;
    if (pathname !== "/") {
      prevpath = pathname.replace(/\/[\w-.$]*$/, "");
    }
    if ((prevpath != null) && prevpath.indexOf("/") === -1) {
      prevpath = "/" + prevpath;
    }
    prelink = prevpath != null ? "<a class='prevpath' href='" + prevpath + "' title='" + prevpath + "'>[up folder]</a>" : "";
    return "<!DOCTYPE HTML>\n<html lang=\"en-US\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Puer-view folder</title>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\" user-scalable=\"no\">\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"/puer/css/folder.css\">\n  " + (weinre(options.weinre)) + "\n</head>\n<body>\n  <div class=\"g-doc\">\n    <h2>current dir:<strong id=\"dir\">" + pathname + "</strong></h2>\n    " + prelink + "\n    " + (list('folder', folders, pathname)) + "\n    " + (list('file', files, pathname)) + "\n    " + (weinre(options.inspect)) + "\n    <div class=\"m-qrcode\">\n      <div id=\"qrcode\">\n      </div>\n      <h3 class=\"title\">scan qrcode to open</h3>\n      <div class=\"m-ips\">\n        <h3>switch ips:</h3>\n        <ul>\n          " + (listips(options.ips, options.port)) + "\n        </ul>\n      </div>\n    </div>\n  </div>\n  <script src=\"/puer/js/folder.js\"></script>\n</body>\n</html> ";
  };

  module.exports = function(app, options) {
    return app.get(/(\/.*)/, function(req, res, next) {
      var path, pathname;
      pathname = req.params[0];
      path = sysPath.join(options.dir, pathname);
      return fs.stat(path, function(err, stats) {
        var files, folders;
        if ((err != null) || !stats.isDirectory()) {
          return next();
        }
        res.noinject = true;
        files = [];
        folders = [];
        return fs.readdir(path, function(err, subs) {
          var body;
          if (err != null) {
            return next();
          }
          subs.forEach(function(file) {
            var filepath;
            filepath = sysPath.join(path, file);
            if (fs.statSync(filepath).isFile()) {
              files.push(file);
            }
            if (fs.statSync(filepath).isDirectory()) {
              return folders.push(file);
            }
          });
          body = toHTML(files, folders, pathname, options);
          res.setHeader("Content-Type", "text/html");
          res.setHeader("Content-Length", Buffer.byteLength(body));
          return res.send(body);
        });
      });
    });
  };

}).call(this);