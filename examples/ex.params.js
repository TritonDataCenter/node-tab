var mod_tab = require('../lib/tab');

mod_tab.emitTable({
    'columns': [ {
	'label': 'PID',
	'align': 'right',
	'width': 5
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

    'rows': [
	[ '60881', 'ttys000', '0:00.19', '-bash' ],
	[ '61674', 'ttys000', '0:00.17', 'vim README.md' ]
    ]
});
