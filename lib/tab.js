/*
 * tab.js: Unix-style tables for command line utilities
 */

var mod_assert = require('assert-plus');
var mod_extsprintf = require('extsprintf');

/* Public interface */
exports.emitTable = emitTable;
exports.TableOutputStream = TableOutputStream;
exports.TableInputStream = TableInputStream;


function TableOutputStream(args)
{
	var out, sep, cols, label, emit;

	mod_assert.object(args, 'args');
	mod_assert.ok(Array.isArray(args.columns),
	    'args.columns must be an array');
	mod_assert.optionalObject(args.stream, 'args.stream');

	out = args.stream || process.stdout;
	sep = ' ';
	cols = [];

	this.tos_out = out;
	this.tos_cols = cols;
	this.tos_header = true;
	this.tos_endrecord = '\n';
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

TableOutputStream.prototype.writeRow = function (row)
{
	var i, n;

	if (this.tos_header) {
		this.tos_cols.forEach(function (col) {
			col.emit(col['label']);
		});

		this.tos_out.write(this.tos_endrecord);
		this.tos_header = false;
	}

	if (Array.isArray(row)) {
		n = Math.min(row.length, this.tos_cols.length);
		for (i = 0; i < n; i++)
			this.tos_cols[i].emit(row[i]);

		for (; i < this.tos_cols.length; i++)
			this.tos_cols[i].emit('');
	} else {
		for (i = 0; i < this.tos_cols.length; i++) {
			this.tos_cols[i].emit(
			    row[this.tos_cols[i]['label']] || '');
		}
	}

	this.tos_out.write(this.tos_endrecord);
};


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
