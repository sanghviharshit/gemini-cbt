var _                  = require('lodash');
var cleankill          = require('cleankill');
var cbt = require('cbt_tunnels');

function CrossBrowserTest() {
  let isRunning = false;

  function stop(done) {
    if(!isRunning) {
      cbt.stop(done);
      isRunning = false;
    }
  };

  return {
    start: function(opts, done) {
      if(isRunning) {
        throw Error('Tunnel already opened.');
      }

      var connectOptions = {
      };

      _.defaults(connectOptions, opts);

      var gridUrl = 'https://' + connectOptions.username + ':' + connectOptions.accessKey + '@crossbrowsertesting.com/wd/hub';

      let cbtConfig = {
        username: connectOptions.username,
        authkey: connectOptions.accessKey,
        quiet: false
      };

      cbt.start(cbtConfig, err => {
        if(err) {
          done(error);
        } else {
          isRunning = true;
          done(null, {gridUrl: gridUrl});
        }
        cleankill.onInterrupt(stop);
      });
    },

    stop: stop
  };
}

module.exports = CrossBrowserTest;
