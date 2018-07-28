# gemini-cbt
Plugin for starting up a [Cross Browser Testing](https://crossbrowsertesting.com) tunnel when running tests with Gemini

[![Build Status](https://travis-ci.org/sanghviharshit/gemini-cbt.svg?branch=master)](https://travis-ci.org/sanghviharshit/gemini-cbt)

> Based on original source code from https://github.com/Saulis/gemini-browserstack

## Requirements
Works with [gemini](https://github.com/gemini-testing/gemini) [v1.0.0](https://github.com/gemini-testing/gemini/releases/tag/v1.0.0) or later.

## Installation
`npm install sanghviharshit/gemini-cbt`

## Configuration
- All parameters supported by cbt_tunnels (https://www.npmjs.com/package/cbt_tunnels)
  - __username__ (optional) sets the username for CBT. Defaults to environmental variable CBT_USERNAME
  - __authkey__ (optional) sets the authkey for CBT. Defaults to environmental variable CBT_ACCESS_KEY

Example configuration for your `.gemini.yml`

```yml
rootUrl: http://localhost:8080/home
gridUrl: http://this.address.is.ignored/so-anything-goes

system:
  plugins:
    cbt:
      username: foo
      authkey: bar
      quiet: true
      tunnelname: foobar

browsers:
  win10_edge17:
    desiredCapabilities:
      browserName: 'MicrosoftEdge'
      version: '17'
      platform: 'Windows 10'
      screenResolution: '1366x768'
      record_video: 'true'
      record_network: 'true'

  macos10_safari11:
    desiredCapabilities:
      browserName: 'Safari'
      version: '11'
      platform: 'Mac OSX 10.13'
      screenResolution: '1366x768'
```

## Environment variables
You can provide the following environment variables to override the default configs
- `CBT_USERNAME` - username for crossbrosertesting.com account
- `CBT_AUTHKEY` - authentication key for crossbrosertesting.com account
- `CBT_ID` - Add an id to test name
- `CBT_QUIET` - start tunnel in quiet mode
- `CBT_BUILD` - to associate the tests with a specific build in crossbrowsertesting.com
- `CBT_TUNNEL_NAME` - to create a named tunnel
- `CBT_MAX_DURATION` - max duration for the test
- `CBT_RECORD_VIDEO` - record video for tests
- `CBT_RECORD_NETWORK` - record network data for tests

### Example
Here is an example `npm run update` command for updating screenshots
```
CBT_USERNAME=xyz@example.com CBT_AUTHKEY=abcd123xyz CBT_BUILD="`git log --pretty=format:'%h' -n 1` - `date +%r`" npm run update
```
