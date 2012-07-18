/*
 * tab.js: Unix-style tables for command line utilities
 */

var mod_assert = require('assert-plus');
var mod_extsprintf = require('extsprintf');

/* Public interface */
exports.emitTable = emitTable;
exports.TableOutputStream = TableOutputStream;
exports.TableInputStream = TableInputStream;

/*
 * Named arguments:
 *
 *    columns		array of objects describing each column, each with the
 *    			following properties:
 *
 *				label		column header
 *
 *				[width]		column field width
 *						default: "label" length
 *
 *				[align]		"left" or "right"
 *						default: "left"
 *
 *			For convenience, you can use a string instead of an
 *			object, in which case the string becomes the label and
 *			defaults are used for "width" and "align".
 *
 *    [omitHeader]	don't emit the header row
 *    			default: false
 *
 *    [columnSeparator]	string to use to separate columns
 *    			default: ' '
 *
 *    [rowSeparator]	string to use to separate rows
 *    			default: '\n'
 *
 *    [stream]		output stream
 *    			default: process.stdout
 */
function TableOutputStream(args)
{
	var out, sep, cols, label, emit;

	mod_assert.object(args, 'args');
	mod_assert.ok(Array.isArray(args.columns),
	    'args.columns must be an array');
	mod_assert.optionalObject(args.stream, 'args.stream');
	mod_assert.optionalString(args.columnSeparator, 'args.columnSeparator');
	mod_assert.optionalString(args.rowSeparator, 'args.rowSeparator');

	out = args.stream || process.stdout;
	sep = args.columnSeparator || ' ';
	cols = [];

	this.tos_out = out;
	this.tos_cols = cols;
	this.tos_header = args['omitHeader'] ? false : true;
	this.tos_endrecord = args.rowSeparator || '\n';
	this.tos_sep = sep;

	args.columns.forEach(function (col, i) {
		var fmt;

		if (typeof (col) == 'string') {
			cols.push({
			    'label': col,
			    'align': 'left',
			    'emit': function (value, last) {
				fprintf(out, '%s' + (last ? '' : sep), value);
			    }
			});

			return;
		}

		label = 'args.columns[' + i + ']';
		mod_assert.object(col, label);
		mod_assert.optionalString(col.label, label + '.label');

		mod_assert.optionalNumber(col.width, label + '.width');
		if (col.hasOwnProperty('width'))
			mod_assert.ok(col.width > 0,
			    label + '.width must be a positive number');

		mod_assert.optionalString(col.align, label + '.align');
		if (col.hasOwnProperty('align'))
			mod_assert.ok(col.align == 'left' ||
			    col.align == 'right',
			    label + '.align must be "left" or "right"');

		if (!col['width'])
			fmt = '%s';
		else if (!col['align'] || col['align'] == 'left')
			fmt = '%-' + col['width'] + 's';
		else
			fmt = '%' + col['width'] + 's';

		emit = function (value, last) {
			fprintf(out, last ? fmt : fmt + sep, value);
		};

		cols.push({
		    'label': col.label || '',
		    'align': col.align || 'left',
		    'width': col.width,
		    'emit': emit
		});
	});
}

/*
 * Emit a single row.  If a header should be emitted but hasn't yet been,
 * it will be emitted before the row is emitted.  The row itself may be one of
 * the following:
 *
 * 	(1) An object with properties corresponding to the table's columns.  For
 *	    example, if the column has labels "pid" and "cmd", each row should
 *	    be an object with these properties.  Missing properties are treated
 *	    as an empty string.
 *
 * 	(2) An array of objects with a toString method.  The nth entry of the
 *	    array is taken as the value of the nth column.  Missing columns are
 *	    treated as an empty string.
 */
TableOutputStream.prototype.writeRow = function (row)
{
	var cols, i, n, val;

	cols = this.tos_cols;

	if (this.tos_header) {
		cols.forEach(function (col, j) {
			col.emit(col['label'], j == cols.length - 1);
		});

		this.tos_out.write(this.tos_endrecord);
		this.tos_header = false;
	}

	if (Array.isArray(row)) {
		n = Math.min(row.length, cols.length);
		for (i = 0; i < n; i++)
			cols[i].emit(row[i], i == n - 1);

		for (; i < cols.length; i++)
			cols[i].emit('', i == cols.length - 1);
	} else {
		for (i = 0; i < cols.length; i++) {
			val =
			    row.hasOwnProperty(cols[i]['label']) ?
			    row[cols[i]['label']] : '';
			cols[i].emit(val, i == cols.length - 1);
		}
	}

	this.tos_out.write(this.tos_endrecord);
};


/*
 * Shorthand for creating a TableOutputStream and emitting a bunch of rows.  The
 * arguments are exactly the same as those for TableOutputStream, with the
 * addition of a required property:
 *
 * 	rows		Array of rows, each of which will become an argument to
 * 			TableOutputStream.writeRow().
 */
function emitTable(args)
{
	mod_assert.object(args);
	mod_assert.ok(Array.isArray(args.rows), 'args.rows must be an array');

	var stream = new TableOutputStream(args);
	args.rows.forEach(function (row) { stream.writeRow(row); });
}

function TableInputStream(args)
{

}

function fprintf(stream)
{
	var args = Array.prototype.slice.call(arguments, 1);
	var str = mod_extsprintf.sprintf.apply(null, args);
	stream.write(str);
}
