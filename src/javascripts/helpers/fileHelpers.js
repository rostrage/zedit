import { remote, shell } from 'electron';
import jetpack from 'fs-jetpack';
import extract from 'extract-zip';
import url from 'url';

let fh = {};

fh.jetpack = jetpack;
fh.appPath = remote.app.getAppPath();
fh.userPath = remote.app.getPath('userData');
fh.userDir = jetpack.cwd(fh.userPath);
fh.appDir = jetpack.cwd(fh.appPath);

// log app directory for reference
console.log('App directory: ' + fh.appPath);

// helper function for loading json file
fh.loadJsonFile = function(filename, defaultValue = []) {
    if (fh.jetpack.exists(filename) === 'file') {
        return fh.jetpack.read(filename, 'json');
    } else {
        return defaultValue;
    }
};

fh.loadTextFile = function(filename, defaultValue = '') {
    if (fh.jetpack.exists(filename) === 'file') {
        return fh.jetpack.read(filename);
    } else {
        return defaultValue;
    }
};

fh.loadResource = function(filename, defaultValue = []) {
    if (fh.appDir.exists(filename) === 'file') {
        return fh.appDir.read(filename, 'json');
    } else {
        return defaultValue;
    }
};

// helper function for saving json files
fh.saveJsonFile = function(filename, value, minify = false) {
    fh.jetpack.write(filename, minify ? JSON.stringify(value) : value);
};

fh.saveTextFile = function(filename, value) {
    fh.jetpack.write(filename, value);
};

fh.openFile = function(filename) {
    if (fh.jetpack.exists(filename)) {
        shell.openItem(fh.jetpack.path(filename));
    }
};

fh.openUrl = function(url) {
    shell.openItem(url);
};

fh.getFileUrl = function(path) {
    return url.format({
        pathname: jetpack.path(path).replace(/\\/g, '/'),
        protocol: 'file:',
        slashes: true
    })
};

fh.extractArchive = function(filePath, destDir, empty = false) {
    fh.jetpack.dir(destDir, { empty: empty });
    extract(filePath, { dir: destDir }, (err) => { throw err });
};

fh.getFileExt = function(filePath) {
    return filePath.match(/.*\.(.*)/)[1];
};

fh.getFileName = function(filePath) {
    return filePath.match(/.*\\(.*)/)[1];
};

fh.getDirectory = function(filePath) {
    return filePath.match(/(.*)\\.*/)[1];
};

fh.getDateModified = function(filename) {
    return fh.jetpack.inspect(filename, {times: true}).modifyTime;
};

fh.getDirectories = function(path) {
    return fh.jetpack.find(path, {
        matching: '*',
        files: false,
        directories: true
    });
};

// helper function for selecting a directory
fh.selectDirectory = function(title, defaultPath) {
    let selection = remote.dialog.showOpenDialog({
        title: title,
        defaultPath: defaultPath,
        properties: ['openDirectory']
    });
    return selection && selection[0];
};

// helper function for selecting a theme
fh.selectFile = function(title, defaultPath, filters = []) {
    let selection = remote.dialog.showOpenDialog({
        title: title,
        defaultPath: defaultPath,
        filters: filters,
        properties: ['openFile']
    });
    return selection && selection[0];
};

export default fh;
