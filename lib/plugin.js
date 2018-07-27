var _ = require('lodash');
var CrossBrowserTest = require('./crossbrowsertest');
var Q = require('q');


function expandCredentials(opts) {
  if (!opts.username) {
    opts.username = process.env.CBT_USERNAME;
  }
  if (!opts.accessKey) {
    opts.accessKey = process.env.CBT_AUTHKEY;
  }
  if (!opts.username || !opts.accessKey) {
    throw Error('Missing CrossBrowserTest credentials. Did you forget to set CBT_USERNAME and/or CBT_AUTHKEY?');
  }
}

module.exports = function(gemini, opts) {
  var crossBrowserTest = CrossBrowserTest();

  expandCredentials(opts);

  gemini.on('startRunner', function(runner) {
    var deferred = Q.defer();

    crossBrowserTest.start(opts, function(err, config) {
      if(err) {
       deferred.reject(err);
      } else {
        // _.forEach(gemini.config.getBrowserIds(), function(browserId) {
        //   var browser = gemini.config.forBrowser(browserId);
        //   browser.gridUrl = config.gridUrl;
        //   // browser.desiredCapabilities['crossbrowsertest.local'] = true;
        //   // if (opts.localIdentifier) {
        //   //   browser.desiredCapabilities['crossbrowsertest.localIdentifier'] = opts.localIdentifier;
        //   // }
        // });

        deferred.resolve();
      }
    });

    return deferred.promise;
  });

  gemini.on('endRunner', function(runner, data) {
    var deferred = Q.defer();

    crossBrowserTest.stop(function() {
      deferred.resolve();
    });

    return deferred.promise;
  });
};
