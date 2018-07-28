var _                  = require('lodash');
var cleankill          = require('cleankill');
var cbt = require('cbt_tunnels');

const createTunnelName = (name) => {
  const excludePattern = /[^a-zA-Z0-9-_]/g
  if (!name) {
    name = `gemini-${new Date().toISOString()}-${Math.random().toString(36).slice(2)}`
  }
  name = name.replace(excludePattern, '-')
  return name.substring(0, 45)
}

function CrossBrowserTest() {
  let isRunning = false;
  function stop(done) {
    if(isRunning) {
      cbt.stop(err => {
        if(err) {
          done(err);
        } else {
          isRunning = false;
          done();
        }
      });
    }
  };

  return {
    start: function(opts, done) {
      if(isRunning) {
        throw Error('Tunnel already opened.');
      }

      var defaultOptions = {
        quiet: false,
      };

      // add defaults
      _.defaults(opts, defaultOptions);

      // Override options from env variables
      var overrideOptions = {
        username: process.env.CBT_USERNAME,
        authkey: process.env.CBT_AUTHKEY,
        tunnelname: process.env.CBT_TUNNEL_NAME,
        quiet: process.env.CBT_QUIET
      };
      _.defaults(overrideOptions, opts);

      // Update tunnelname
      overrideOptions.tunnelname = createTunnelName(overrideOptions.tunnelname);

      if (!overrideOptions.username || !overrideOptions.authkey) {
        throw Error('Missing CrossBrowserTest credentials. Did you forget to set CBT_USERNAME and/or CBT_AUTHKEY?');
      }

      var gridUrl = 'https://' + overrideOptions.username + ':' + overrideOptions.authkey + '@crossbrowsertesting.com/wd/hub';

      cbt.start(overrideOptions, err => {
        if(err) {
          done(err);
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
