var gulp = require('gulp');
var mocha = require('gulp-mocha');
var fs = require('fs');
var git = require('gulp-git');

gulp.task('default', ['run tests', 'push to git']);

gulp.task('run tests', function(){
  return gulp.src('test/*')
    .pipe(mocha())
    .on('error', function (err) {

      if (err.toString().match(/mocha\/lib\/mocha\.js/)) {

        var stream = fs.createWriteStream('log/gulp.log', {'flags': 'a'});

        stream.end(err.toString(), 'utf8', function () {
          console.log('mocha error logged');
          process.exit(1);
        });
      } else {
        console.log(err.toString());

      }
    })
    .on('end', function () {
      console.log('tests ran successfully');
    });
});

gulp.task('push to git', ['run tests'], function(){
  //var gitUsername = '';
  //var gitPassword = '';
  var gitRepoUrl = 'github.com/mattdallin/gulp-mocha-git';
  var gitBranch = 'gulp-automated';
  var gitOrigin = 'https://' + gitRepoUrl;
  //var gitOrigin = 'https://' + gitUsername + ':' + gitPassword + '@' + gitRepoUrl;
  //git.status({args : '--porcelain'}, function (err, stdout) {
  //  // if (err) ...
  //  console.log(stdout);
  //});
  gulp.src('./*')
    .pipe(git.add({args: '--all'}))
    .pipe(git.commit('gulp commit', {disableAppendPaths: true, disableMessageRequirement: false}));
  console.log('ready to push');
  git.push(gitOrigin, gitBranch, {args: ''}, function (err,msg) {
    console.log('pushed');
    console.log(msg);
    if (err) throw err;
    });
});