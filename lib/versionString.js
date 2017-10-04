const packageJSON = require('../package.json');

module.exports = '"version":"' + packageJSON.name + '@' + packageJSON.version + '"';
