var mod_tab = require('../lib/tab');

/* This example processes default "ps" output. */
var input = new mod_tab.TableInputStream({
    'stream': process.stdin,
    'columns': [ 'pid', 'tty', 'time', 'cmd' ]
});

input.on('row', console.log);
process.stdin.resume();
