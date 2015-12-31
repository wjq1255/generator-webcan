'use strict';
module.exports = function(grunt) {
	grunt.config.set('watch', {
		options: {
          	livereload: true
        },
		html: {
			files: ['src/webcan/{,*/}*.html', 'src/webcan/*.html', 'src/webcan/tpl/*.html'],
			tasks: ['restart']
		},
		js: {
			files: ['src/webcan/**/*.js'],
			tasks: ['restart']
		},
		data: {
			files: ['src/data/*.json'],
			tasks: ['restart']
		}
	});
};