var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('crossbrowsertest', function() {
  var crossbrowsertest,
  cleankill,
  cbt;

  before(function() {
    cleankill = sinon.spy();

    cbt = {
      start: function(opts, cb) { cb(); },
      stop: function(opts, cb) { cb(); },
      status: function(opts, cb) { cb(); }
    }

    mockery.registerMock('cleankill', cleankill);
    mockery.registerMock('cbt_tunnels', cbt);
  });

  beforeEach(function() {
    cleankill.reset();
    var opts;
    cbt.start = function(opts, cb) { cb(); }

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    // console.log(require('cbt_tunnels'));

    crossbrowsertest = require('../lib/crossbrowsertest')();

    mockery.disable();
  });

  describe('start', function() {
    var opts, done;

    function start() {
      crossbrowsertest.start(opts, done);
    };

    beforeEach(function() {
      opts = {username: "foo", authkey: "bar"};
      done = sinon.spy();
      cleankill.onInterrupt = sinon.spy();
    });

    afterEach(function() {
      delete process.env.CBT_USERNAME;
      delete process.env.CBT_AUTHKEY;
    });

    it('should throw error if tunnel already opened', function() {
      start();

      expect(function() { start(); }).to.throw(Error);
    });

    it('should callback with gridUrl.', function() {
      start();

      expect(done.args[0][1].gridUrl).to.equal('https://foo:bar@crossbrowsertesting.com/wd/hub');
    });

    it('should enable cleankill on interrupt', function() {
      start();

      expect(cleankill.onInterrupt.called).to.be.true;
    });

    it('should return error on start if credentials not provided', function() {
      opts = {};
      expect(function() { start(); }).to.throw(Error);
    });

    it('should read credentials from env', function() {
      process.env.CBT_USERNAME = 'foobar';
      process.env.CBT_AUTHKEY = 'barfoo';
      opts = {};
      expect(function() { start(); }).to.not.throw(Error);
    });

  });

  describe('stop', function() {
    var done;

    function stop() {
      crossbrowsertest.stop(done);
    };

    beforeEach(function() {
      done = sinon.spy();
      cbt.stop = sinon.spy(function(cb) { cb(); });
    });

    it('should close the tunnel', function() {
      cleankill.onInterrupt = sinon.spy();
      crossbrowsertest.start({username: "foo", authkey: "bar"}, sinon.spy());

      stop();

      expect(cbt.stop.called).to.be.true;
      expect(done.called).to.be.true;
    });
  });
});
