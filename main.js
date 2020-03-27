'use strict';
var https = require('https')
var fs = require('fs')
var admzip = require('adm-zip')
var path = require('path')
var nodemerge = require('node-merge-fix')

/**
 * @param {string} username Asking for the owner of the repository
 * @param {string} reponame Asks for the PUBLIC repository name
 * @param {boolean} doPrereleases Whether or not to skip over Prereleases and go to the Latest Release
 * @param {boolean} doOverwrite Whether to overwrite existing files or not
 * @param {number} posFromLatest Updates to a version that is not a prerelease or a latest release, overrides {@link doPrereleases}
 * @param {Array} filter Ignore filenames. The bot will replace botconfig.json if NOT specified.
 * @author xTeal
 */
module.exports.downloadRelease = async function (username, reponame, doPrereleases = true, doOverwrite = true, posFromLatest = 0, filter = []) {
    var __results = []
    function removeDir(dirPath) {
        if (fs.existsSync(dirPath) !== true) {
            return;
        }
    
        var list = fs.readdirSync(dirPath);
        for (var i = 0; i < list.length; i++) {
            var filename = path.join(dirPath, list[i]);
            var stat = fs.statSync(filename);
    
            if (filename == "." || filename == "..") {
            } else if (stat.isDirectory()) {
                removeDir(filename);
            } else {
                fs.unlinkSync(filename);
            }
        }
    
        fs.rmdirSync(dirPath);
    };

    if(fs.existsSync('./bot.zip') == true) {
        fs.unlinkSync('./bot.zip')
    }
    removeDir('./releases')
    https.get({hostname: `api.github.com`, path: `/repos/${username}/${reponame}/releases`, headers: {'User-Agent': 'a-discord-bot-updater'}}, async response => {
        var str = ''
        response.on('data', (data) => {
            str += data
        })
        response.on('end', async function() {
        var releases = JSON.parse(str)
    if(!releases.length > 0) return __results.push('No releases in repository.')
    else
    var num = 0
    if(posFromLatest == 0 && posFromLatest) {
    if(doPrereleases == false) {
        for(var release in releases) {
            if(releases[release].prerelease == false) break
            else num++; continue
        }
    } 
    } else {
        if(typeof posFromLatest !== 'number') { __results.push('posFromLatest set to 0 because it needs to be a number.'); posFromLatest = 0}
        else
        if(posFromLatest < 0) { __results.push('posFromLatest set to 0 because it needs to be above 0.'); posFromLatest = 0}
        else
        if(posFromLatest > releases.length) { __results.push('posFromLatest set to 0 because it needs to be a number above ' + releases.length)}
        else num = posFromLatest;
    }
    var zip = fs.createWriteStream('./bot.zip')
    fs.mkdirSync('releases', {recursive: true})
    https.get(`https://codeload.github.com/${username}/${reponame}/zip/${releases[num].tag_name}`, async function(response) {
        response.pipe(zip)
    })
    zip.on('close', async function() {
            var unzip = new admzip('./bot.zip')
            unzip.extractAllTo(`./releases/`, true)
            if(fs.existsSync(`./releases/${reponame}-${releases[num].tag_name}/package.json`) !== true || fs.existsSync(`./releases/${reponame}-${releases[num].tag_name}/package-lock.json`) !== true) {
                removeDir('./releases')
                return __results.push('Repository doesn\'t have package.json and package-lock.json');
            } else

            var PKG = JSON.parse(fs.readFileSync(`./releases/${reponame}-${releases[num].tag_name}/package.json`, "utf8"))
            var thisPKG = JSON.parse(fs.readFileSync(`./package.json`, "utf8"))

            checkVersion(PKG.version, thisPKG.version)
            if(checkVersion(PKG.version, thisPKG.version) == true) {
                removeDir(`./releases`)
                fs.unlinkSync(`./bot.zip`)
                return __results.push(`Version of package you are downloading is below ${PKG.version}.`);
            } else 
            desync(filter)
            await nodemerge.mergeTo(`./releases/${reponame}-${releases[num].tag_name}`, "./", {overwrite: doOverwrite, silent: true})
            fs.unlinkSync(`./bot.zip`)
            removeDir('./releases')
            return __results.push('Finished.')
        })})})
}

/**
 * 
 * @param {string} githubver The package downloaded from Github
 * @param {string} packver This package version
 * @private
 */
module.exports.checkVersion = async function (githubver, packver) {
    var one = githubver.split('.')
    var two = packver.split('.')
    let arr = []
    var isBE = (V) => V < 0
    var isAbove = (V) => V > 0
    var isOrAbove = (V) => V >= 0
    for(var i in one) {
      var thing = one[i] - two[i]
      arr.push(thing)
      var t = parseInt(i) + 1
      if(t !== one.length) continue;
      else 
      var dupe = arr.concat()
      dupe.pop()
      dupe.shift()
     if(!dupe.some(isAbove) && !arr.every(isOrAbove)) {return false;}
     else
     if(!dupe.some(isAbove) && arr.some(isBE)) {return false;}
     else
     if(one.length < two.length) {return false;}
     else 
    return true;
}}

/**
 * 
 * @param {object} array 
 */
function desync(array) {
    for(var i in array) {
        if(fs.existsSync(array[i]) !== true) {
            continue;
        }
        if(array[i].includes('package-lock.json')) continue;
        if(array[i].includes('package.json')) continue;
        fs.unlinkSync(`${array[i]}`); continue;
    }
}
