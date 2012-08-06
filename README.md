# node-tab: Unix-style tables for command-line utilities

This module implements functions for reading and writing Unix-style command line
tables.  The model mimics that of traditional Unix commands like "ps", which
emit a table with a default set of columns that can be customized using command
line options.  This module implements facilities to both ingest and emit these
tables.

## Output overview

### Simple tables

To write a simple table to stdout:

    var mod_tab = require('tab');

    mod_tab.emitTable({
        'columns': [ 'PID', 'TTY', 'TIME', 'CMD' ],
        'rows': [
            [ '60881', 'ttys000', '0:00.19', '-bash' ],
            [ '61674', 'ttys000', '0:00.17', 'vim README.md' ]
        ]
    });

This outputs:

   PID TTY TIME CMD 
   60881 ttys000 0:00.19 -bash 
   61674 ttys000 0:00.17 vim README.md 

### Alternate output stream

You can send this to a stream like stderr instead by specifying the 'stream'
property:

    mod_tab.emitTable({
        'stream': process.stderr,
        'columns': [ 'PID', 'TTY', 'TIME', 'CMD' ],
        'rows': [
            [ '60881', 'ttys000', '0:00.19', '-bash' ],
            [ '61674', 'ttys000', '0:00.17', 'vim README.md' ]
        ]
    });

### Controlling field width and alignment

To make the output look more like ps(1), you could specify field widths and
alignments:

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

        'rows': [
            [ '60881', 'ttys000', '0:00.19', '-bash' ],
            [ '61674', 'ttys000', '0:00.17', 'vim README.md' ]
        ]
    });

This would output:

      PID TTY           TIME CMD
    60881 ttys000    0:00.19 -bash
    61674 ttys000    0:00.17 vim README.md

### Using objects for rows

If you want, data (rows) can be specified with objects instead of arrays, where
the object keys keys correspond to field labels.  This example outputs the same
as the previous one:

    mod_tab.emitTable({
        'columns': [ {
            'label': 'PID',
            'align': 'right',
            'width': 6
        }, {
            'label': 'TTY',
            'width': 7,
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

### Streaming interface

Instead of accumulating the data in memory and emitting the whole table, you can
create a TableOutputStream object with the field configuration and then emit
individual records:

    var out = new mod_tab.TableOutputStream({
        'columns': [ 'PID', 'TTY', 'TIME', 'CMD' ]
    });

    out.writeRow([ '60881', 'ttys000', '0:00.19', '-bash' ]);

    /* or */

    out.writeRow({
        'PID': '61674',
        'TTY': 'ttys000',
        'TIME': '0:00.17',
        'CMD': 'vim README.md'
    });


### Other options

You can also omit the header row or change the column and row separators:

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


## Input overview

The goal of the input interface is to ingest such tables as either objects or
arrays (as desired).

To ingest streaming tabular input, create a TableInputStream and listen for the
"row" event:

    var input = new mod_tab.TableInputStream({
        'stream': process.stdin,
        'columns': [ 'pid', 'tty', 'time', 'cmd' ]
    });

    input.on('row', console.log);

For the above outputs, this would emit:

    { pid: '60881',
      tty: 'ttys000',
      time: '0:00.19',
      cmd: '-bash' }
    { pid: '61674',
      tty: 'ttys000',
      time: '0:00.17',
      cmd: 'vim README.md' }

If the first row is the header row, you can leave off "columns":

    var input = new mod_tab.TableInputStream({ 'stream': process.stdin });
    input.on('row', console.log);

Pipe "ps" to that and get:

    { PID: '60881',
      TTY: 'ttys000',
      TIME: '0:00.19',
      CMD: '-bash' }
    { PID: '61674',
      TTY: 'ttys000',
      TIME: '0:00.17',
      CMD: 'vim README.md' }

You could get arrays instead by specifying the 'format' property:

    var input = new mod_tab.TableInputStream({
        'format': 'array',
        'stream': process.stdin,
    });

    input.on('row', function (row) {
        console.log(row);
    });

This would emit:

    [ '60881', 'ttys000', '0:00.19', '-bash' ]
    [ '61674', 'ttys000', '0:00.17', 'vim README.md' ]

You can also specify a different delimiter from the default (which is any
whitespace) using a string or regular expression for the 'delim' property, as
in:

    /* split on colons instead of whitespace */
    var input = new mod_tab.TableInputStream({
        'delim': ':'
        'stream': process.stdin,
        'columns': [ 'pid', 'tty', 'time', 'cmd' ]
    });

    /* split on semicolon or comma */
    var input = new mod_tab.TableInputStream({
        'delim': /[,;]/,
        'stream': process.stdin,
        'columns': [ 'pid', 'tty', 'time', 'cmd' ]
    });
