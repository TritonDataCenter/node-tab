var mod_tab = require('../lib/tab');

var out = new mod_tab.TableOutputStream({
    'columns': [ 'PID', 'TTY', 'TIME', 'CMD' ]
});

out.writeRow([ '60881', 'ttys000', '0:00.19', '-bash' ]);
out.writeRow({
    'PID': '61674',
    'TTY': 'ttys000',
    'TIME': '0:00.17',
    'CMD': 'vim README.md'
});
