var mod_tab = require('../lib/tab');

mod_tab.emitTable({
    'columns': [ {
	'label': 'PID',
	'align': 'right',
	'width': 6
    }, {
	'label': 'TTY',
	'width': 7
    }, {
	'label': 'TIME',
	'align': 'right',
	'width': 10
    }, {
	'label': 'CMD'
    } ],

    'rows': [ {
	'PID': '60881',
	'TTY': 'ttys000',
	'TIME': '0:00.19',
	'CMD': '-bash'
    }, {
	'PID': '61674',
	'TTY': 'ttys000',
	'TIME': '0:00.17',
	'CMD': 'vim README.md'
    } ]
});
