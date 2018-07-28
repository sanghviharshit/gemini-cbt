var _ = require('lodash');
var CrossBrowserTest = require('./crossbrowsertest');
var Q = require('q');

module.exports = function(gemini, opts) {
  var crossBrowserTest = CrossBrowserTest();

  gemini.on('startRunner', function(runner) {
    var deferred = Q.defer();

    crossBrowserTest.start(opts, function(err, config) {
      if(err) {
       deferred.reject(err);
      } else {
        _.forEach(gemini.config.getBrowserIds(), function(browserId) {
          var browser = gemini.config.forBrowser(browserId);
          browser.gridUrl = config.gridUrl;
          // browser.desiredCapabilities['crossbrowsertest.local'] = true;
          // if (opts.localIdentifier) {
          //   browser.desiredCapabilities['crossbrowsertest.localIdentifier'] = opts.localIdentifier;
          // }
        });

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
