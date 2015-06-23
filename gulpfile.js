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
  var gitRepoUrl = 'github.com/mattdallin/gulp-mocha-git';
  var gitBranch = 'master';
  var gitOrigin = 'https://' + gitRepoUrl;
  //var gitUsername = '';
  //var gitPassword = '';
  //var gitOrigin = 'https://' + gitUsername + ':' + gitPassword + '@' + gitRepoUrl;

  gulp.src('./*')
    .pipe(git.add({args: '--all'}))
    .pipe(git.commit('gulp commit - ' + new Date(), {disableAppendPaths: true, disableMessageRequirement: false}))
    .on('error', function(err){
      console.log(err.toString())
    });

    git.push(gitOrigin, gitBranch, {}, function (err) {
      console.log('pushed');
      if (err) throw err;
    });
});