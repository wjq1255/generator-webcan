'use strict';
module.exports = function(grunt) {
	grunt.config.set('copy', {
		index: {
			cwd: 'src/webcan',
			src: 'index.html',
			dest: 'dist/webcan',
			expand: true
		},
		resource: {
			cwd: 'src/frm',
			src: ['**/*.*'],
			dest: 'dist/frm/',
			expand: true
		},
		data: {
			cwd: 'src/data',
			src: ['*.*'],
			dest: 'dist/data/',
			expand: true
		},
		demo: {
			cwd: 'src/webcan',
			src: ['**/*.*'],
			dest: 'dist/webcan',
			expand: true
		}
	});
};