var gulp = require('gulp');
var mocha = require('gulp-mocha');
var fs = require('fs');
var git = require('gulp-git');
var gutil = require('gulp-util');

gulp.task('default', ['run tests', 'push to git']);

gulp.task('run tests', function(){
  return gulp.src('test/*')
    .pipe(mocha())
    .once('error', function (err) {
      var stream = fs.createWriteStream('log/gulp.log', {'flags': 'a'});

      stream.end(err.toString(), 'utf8', function(){
        console.log('error logged');
        //console.log(err.toString());
        //process.exit(1);
      });
    })
    .once('end', function () {
      console.log('tests ran successfully');
    });
});

gulp.task('push to git', ['run tests'], function(){
  //var gitUsername = '';
  //var gitPassword = '';
  var gitRepoUrl = 'github.com/mattdallin/gulp-mocha-git';
  var gitBranch = 'master';
  var gitOrigin = 'https://' + gitRepoUrl;
  //var gitOrigin = 'https://' + gitUsername + ':' + gitPassword + '@' + gitRepoUrl;

  gulp.src('./*')
    .pipe(git.add())
    .pipe(git.commit('gulp commit'));

  git.push(gitOrigin, gitBranch, {args: ''});
});