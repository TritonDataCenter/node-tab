var mod_tab = require('../lib/tab');

/*
 * Given column names on stdin, this emits incoming rows as JSON.  Try:
 *    $ ps | node examples/ex.input_named.js pid tty time cmd
 */
var input = new mod_tab.TableInputStream({
    'stream': process.stdin,
    'columns': process.argv.slice(2)
});

input.on('row', console.log);
process.stdin.resume();
