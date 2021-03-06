/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
'use strict';

const loaderUtils = require("loader-utils");
const mime = require("mime");
const sizeOf = require('image-size');
/*
const fs = require('fs');
const Promise = require('promise');
const crypto = require('crypto');

const createTimeoutPromise = (timeout) => new Promise((resolve, reject) => {
  setTimeout(reject, timeout, 'fs operation timeout');
});

function timeoutableDenodeify(fsFunc, timeout) {
  return function raceWrapper() {
    var args = arguments;
    return new Promise.race([
      createTimeoutPromise(timeout),
      Promise.denodeify(fsFunc).apply(this, args)
    ]);
  };
}
*/

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	var limit = (this.options && this.options.url && this.options.url.dataUrlLimit) || 0;
	if(query.limit) {
		limit = parseInt(query.limit, 10);
	}
	var mimetype = query.mimetype || query.minetype || mime.lookup(this.resourcePath);
/*
  var path = this.resourcePath;

  var pieces = path.split('/');
  var filePieces = pieces[pieces.length - 1].split('.');
  var name = filePieces[0];
  var fileType = filePieces[filePieces.length-1];
  var realPath = path.substr(0, path.lastIndexOf('/'));
  var image = sizeOf(this.resourcePath);
  const files = [this.resourcePath];
  const stat = timeoutableDenodeify(fs.stat, 5000);
  let hash_str;
  Promise.all(
    files.map(file => stat(file))
  ).then(stats => {
    const hash = crypto.createHash('md5');
    stats.forEach(fstat =>
      hash.update(fstat.mtime.getTime().toString())
    );
    hash_str = hash.digest('hex');
  })
*/ 

	if(limit <= 0 || content.length < limit) {
    /*
    const asset = {"__packager_asset":true,"fileSystemLocation":realPath,"httpServerLocation":"/assets/img","width":image.width,"height":image.height,"scales":[1],"files":[path],"hash":hash_str,"name":name,"type":fileType};
    const json = JSON.stringify(asset);
    const assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';
    const code =
      `module.exports = require(${JSON.stringify(assetRegistryPath)}).registerAsset(${json});`;
		return code;
    */
    const data = {uri: "data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"), scale: 1}
    const json = JSON.stringify(data);
    return "module.exports = " + json + ";";
	} else {
	  if(!this.emitFile) throw new Error("emitFile is required from module system");
    const url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
      context: query.context || this.options.context,
      content: content,
      regExp: query.regExp
    });
    this.emitFile(url, content);
    const data = {uri: __webpack_public_path__ + JSON.stringify(url) };
    return "module.exports = " + JSON.stringify(data) + ";";
	}
}
module.exports.raw = true;

