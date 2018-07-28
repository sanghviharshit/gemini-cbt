var _ = require('lodash');
var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');


describe('plugin', function() {
  var plugin,
  gemini,
  q,
  deferred,
  crossbrowsertest;

  before(function() {
    q = sinon.spy();
    crossbrowsertest = sinon.spy();

    mockery.registerMock('q', q);
    mockery.registerMock('./crossbrowsertest', function() { return crossbrowsertest; });
  });

  beforeEach(function() {
    q.reset();
    crossbrowsertest.reset();

    gemini = sinon.spy();
    gemini.on = function(event, cb) {
      gemini[event] = cb;
    };

    gemini.config = {
      getBrowserIds: function () {
        return _.keys(gemini.config._browsers)
      },
      forBrowser: function (browserId) {
        return gemini.config._browsers[browserId]
      },
      _browsers: {}
    };

    deferred = sinon.spy();
    deferred.resolve = sinon.spy();
    deferred.reject = sinon.spy();

    q.defer = sinon.spy(function() {
      return deferred;
    });

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    plugin = require('../lib/plugin');

    mockery.disable();
  });

  function init() {
    plugin(gemini, {username: 'foo', authkey: 'bar'});
  };

  describe('on startRunner', function() {
    function startRunner() {
      return gemini['startRunner']();
    };

    beforeEach(function() {
      init();
      crossbrowsertest.start = sinon.spy();
    });

    it('should start crossbrowsertest tunnel', function() {
      startRunner();

      expect(crossbrowsertest.start.called).to.be.true;
    });

    it('should inject gridUrl to browsers', function() {
      gemini.config._browsers = {'chrome': {desiredCapabilities: {platform: 'Windows'}}};
      crossbrowsertest.start = function(opts, cb) {
        cb(null, {gridUrl: 'url'});
      };

      startRunner();

      expect(gemini.config._browsers.chrome.gridUrl).to.equal('url');
    });

    it('should return a promise', function() {
      deferred.promise = sinon.spy();

      expect(startRunner()).to.equal(deferred.promise);
    });

    it('should resolve the given promise', function() {
      crossbrowsertest.start = function(opts, cb) {
        cb(null, {});
      };

      startRunner();

      expect(deferred.resolve.called).to.be.true;
    });

    it('should reject on error', function() {
      crossbrowsertest.start = function(opts, cb) {
        cb('error', {});
      };

      startRunner();

      expect(deferred.reject.called).to.be.true;
    });
  });

  describe('on endRunner', function() {
    function endRunner() {
      return gemini['endRunner']();
    };

    beforeEach(function() {
      plugin(gemini, {username: 'foo', authkey: 'bar'});
      crossbrowsertest.stop = sinon.spy();
    });

    it('should stop crossbrowsertest tunnel', function() {
      endRunner();

      expect(crossbrowsertest.stop.called).to.be.true;
    });

    it('should return a promise', function() {
      deferred.promise = sinon.stub();

      expect(endRunner()).to.equal(deferred.promise);
    });

    it('should resolve the given promise', function() {
      crossbrowsertest.stop = function(cb) {
        cb();
      }

      endRunner();

      expect(deferred.resolve.called).to.be.true;
    });
  });
});
