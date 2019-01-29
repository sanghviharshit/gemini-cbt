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
          let capabilities = browser.desiredCapabilities;
          // CrossBrowserTesting-Specific Capabilities
          if (process.env.CBT_ID) {
            capabilities.name = `${process.env.CBT_ID}`;
          } else {
            capabilities.name = browserId;
          }
          if (process.env.CBT_BUILD)
            capabilities.build = process.env.CBT_BUILD;
          if (process.env.CBT_RECORD_VIDEO)
            capabilities.record_video = process.env.CBT_RECORD_VIDEO.match(/true/i);
          if (process.env.CBT_RECORD_NETWORK)
            capabilities.record_video = process.env.CBT_RECORD_NETWORK.match(/true/i);
          if (process.env.CBT_MAX_DURATION)
            capabilities.max_duration = process.env.CBT_MAX_DURATION;

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
