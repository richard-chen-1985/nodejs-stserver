var fs = require('fs');
var path = require('path');

var TEMP_ROOT;
var IS_WIN = process.platform.indexOf('win') === 0;

var _ = module.exports;

_.getLogFile = function() {
    return path.join(_.getTmpPath(), 'stserver.log');
};

_.pid = function(value) {
    var pidFile = path.join(_.getTmpPath(), 'stserver.pid');
    if (typeof value !== 'undefined') {
        fs.writeFileSync(pidFile, value, {
            encoding: 'UTF-8'
        });
    } else {
        value = fs.readFileSync(pidFile, {
            encoding: 'UTF-8'
        });
    }
    return value;
};

_.log = function(str) {
    fs.appendFileSync(_.getLogFile(), str, {
        encoding: 'UTF-8'
    });
};

_.getTmpPath = function() {
    if (!TEMP_ROOT) {
        var list = ['LOCALAPPDATA', 'APPDATA', 'HOME'];
        var tmp;
        for (var i = 0, len = list.length; i < len; i++) {
            if ((tmp = process.env[list[i]])) {
                break;
            }
        }
        tmp = tmp || __dirname + '/../';
        TEMP_ROOT = tmp;
    }
    return TEMP_ROOT;
};

_.isWin = function() {
  return IS_WIN;
};

_.open = function(path, callback) {
    var child_process = require('child_process');
    var cmd = '"' + path + '"';
    if (_.isWin()) {
        cmd = 'start "" ' + cmd;
    } else {
        if (process.env['XDG_SESSION_COOKIE'] ||
            process.env['XDG_CONFIG_DIRS'] ||
            process.env['XDG_CURRENT_DESKTOP']) {
            cmd = 'xdg-open ' + cmd;
        } else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
            cmd = 'gnome-open ' + cmd;
        } else {
            cmd = 'open ' + cmd;
        }
    }
    child_process.exec(cmd, callback);
};