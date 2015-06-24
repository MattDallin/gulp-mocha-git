(function(){
  'use strict';

  var gulp = require('gulp');
  var mocha = require('gulp-mocha');
  var fs = require('fs');
  var git = require('gulp-git');

  gulp.task('default', ['run tests', 'commit', 'push to git']);

  gulp.task('run tests', function(){
    return gulp.src('test/*')
      .pipe(mocha())
      .on('error', function (err) {
        if (err.toString().match(/mocha\/lib\/mocha\.js/)) {
          var stream = fs.createWriteStream('log/gulp.log', {'flags': 'a'});
          stream.end(err.toString(), 'utf8', function () {
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

  gulp.task('commit', ['run tests'], function(){
    gulp.src('.')
      .pipe(git.add({args: '--all'}))
      .pipe(git.commit('gulp commit - ' + new Date(), {disableAppendPaths: true, disableMessageRequirement: false}))
      .on('error', function(err){
        console.log(err.toString());
        console.log('Do you have changes to commit?');
      });
  });

  gulp.task('push to git', ['run tests', 'commit'], function(){
    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    var gitBranch = config.gitBranch || 'master';
    var gitRepoUrl = config.gitRepoUrl || 'github.com/mattdallin/gulp-mocha-git';
    var gitUsername = config.gitUsername || false;
    var gitPassword = config.gitPassword || false;
    var gitOrigin = (!!gitUsername && !!gitPassword) ? 'https://' + gitUsername + ':' + gitPassword + '@' + gitRepoUrl : 'https://' + gitRepoUrl;

    git.push(gitOrigin, gitBranch, {}, function (err) {
      if (err) throw err;
    });
  });
}());