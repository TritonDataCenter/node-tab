/*
 * tab.js: Unix-style tables for command line utilities
 */

var mod_assert = require('assert-plus');

/* Public interface */
exports.emitTable = emitTable;
exports.TableOutputStream = TableOutputStream;
exports.TableInputStream = TableInputStream;


function TableOutputStream(args)
{
	var i, col, label;

	mod_assert.object(args, 'args');
	mod_assert.array(args.columns, 'args.columns');
	mod_assert.optionalObject(args.stream, 'args.stream');

	this.tos_out = args.stream || process.stdout;
	this.tos_cols = [];

	for (i = 0; i < args.columns.length; i++) {
		col = args.columns[i];

		if (typeof (col) == 'string') {
			this.tos_cols.push({
			    'label': col,
			    'align': 'left'
			});

			continue;
		}

		label = 'args.columns[' + i + ']';
		mod_assert.object(col, label);
		mod_assert.optionalString(col.label, label + '.label');
		mod_assert.optionalNumber(col.width, label + '.width');
		mod_assert.ok(col.width > 0,
		    label + '.width must be a positive number');
		mod_assert.optionalString(col.align, label + '.align');
		mod_assert.ok(col.align == 'left' || col.align == 'right',
		    label + '.align must be "left" or "right"');

		this.tos_cols.push({
		    'label': col.label || '',
		    'align': col.align || 'left',
		    'width': col.width
		});
	}
}

TableOutputStream.prototype.writeRow = function ()
{

};


function emitTable()
{
}


function TableInputStream(args)
{

}
