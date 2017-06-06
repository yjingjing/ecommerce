var gulp=require('gulp');
var less=require('gulp-less');
var minify=require('gulp-minify-css');
gulp.task('less',function(){
	gulp.src('public/css/*.less').pipe(less()).pipe(minify()).pipe(gulp.dest('public/css/'));
});
gulp.task('default',function(){
	gulp.watch('public/css/*.less',['less']);
});
