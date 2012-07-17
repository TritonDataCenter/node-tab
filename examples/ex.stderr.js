var mod_tab = require('../lib/tab');

mod_tab.emitTable({
    'stream': process.stderr,
    'columns': [ 'PID', 'TTY', 'TIME', 'CMD' ],
    'rows': [
	[ '60881', 'ttys000', '0:00.19', '-bash' ],
	[ '61674', 'ttys000', '0:00.17', 'vim README.md' ]
    ]
});
