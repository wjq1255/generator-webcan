// 包装函数
module.exports = function(grunt){

	//任务配置，所有插件的配置信息
	grunt.initConfig({});
    require('load-grunt-tasks')(grunt); //下载所有的配置插件组件
    require('./grunt/jshint')(grunt); //js压缩
    require('./grunt/clean')(grunt); //清除文件夹
    require('./grunt/copy')(grunt); //复制文件
    require('./grunt/uglify')(grunt); //js压缩
    require('./grunt/connect')(grunt); //启动
    require('./grunt/open')(grunt); //打开页面
    require('./grunt/watch')(grunt); //实时监控
    require('./grunt/reload')(grunt); //重新载入

    //执行任务
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('serve', function() {
        // grunt.task.run(['clean', 'jshint', 'uglify', copy', 'connect', 'open', 'watch']);
        grunt.task.run([ 'clean', 'copy', 'connect', 'open', 'watch']);
    });

    grunt.registerTask('restart', function() {
        grunt.task.run([ 'clean', 'copy' ]);
    });

    grunt.registerTask('build', function() {
        grunt.task.run(['clean', 'jshint', 'uglify', 'copy']);
    });
    grunt.registerTask('rebuild', function() {
        grunt.task.run(['clean', 'uglify', 'copy']);
    });

};