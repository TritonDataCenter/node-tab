var mod_tab = require('../lib/tab');

mod_tab.emitTable({
    'columns': [ 'name', 'passwd', 'uid', 'gid', 'gecos', 'home', 'shell' ],
    'columnSeparator': ':',
    'rowSeparator': ';\n',
    'omitHeader': true,
    'rows': [
	[ 'root', '*', '0', '0', 'Admin', '/var/root', '/bin/sh' ],
	[ 'nobody', '*', '-2', '-2', 'Unpriv', '/var/empty', '/usr/bin/false' ]
    ]
});
