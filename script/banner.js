const pkg = require('../package.json');
const yearString = 2017 === (new Date).getFullYear() ? '2017' : '2017-' + (new Date).getFullYear();
const banner = `/*!
 * ${pkg.name}-${pkg.version}
 * (c) ${pkg.author} ${yearString} ${pkg.license}
 */
 `;

process.stdout.write(banner);
