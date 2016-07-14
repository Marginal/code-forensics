var fs         = require('fs'),
    _          = require('lodash'),
    utils      = require('../utils'),
    vcsSupport = require('../vcs_support'),
    pp         = require('../parallel_processing');

module.exports = function(context, taskDef) {
  var vcsAdapter = vcsSupport.adapter(context.repository.root);
  taskDef.add('vcs-log-dump', 'Retrieve stats from vcs log entries\nUsage: gulp vcs-log-dump [--dateFrom <date> --dateTo <date>]', function(cb) {
    return pp.taskExecutor().processAll(utils.functions.arrayToFnFactory(context.timePeriods, function(period) {
      if (!utils.fileSystem.isFile(context.files.temp.vcslog(period))) {
        return vcsAdapter.logStream(period)
        .pipe(fs.createWriteStream(context.files.temp.vcslog(period)));
      }
    }));
  });

  taskDef.add('vcs-log-messages', 'Retrieve commit messages from vcs log entries\nUsage: gulp vcs-log-messages [--dateFrom <date> --dateTo <date>]', function() {
    return pp.taskExecutor().processAll(utils.functions.arrayToFnFactory(context.timePeriods, function(period) {
      if (!utils.fileSystem.isFile(context.files.temp.vcslogMessages(period))) {
        return vcsAdapter.commitMessagesStream(period)
        .pipe(fs.createWriteStream(context.files.temp.vcslogMessages(period)));
      }
    }));
  });
};