var mod_tab = require('../lib/tab');

/*
 * Given column names in the first row, this emits incoming rows as JSON.  Try:
 *    $ ps | node examples/ex.input.js
 */
var input = new mod_tab.TableInputStream({ 'stream': process.stdin });
input.on('row', console.log);
process.stdin.resume();
