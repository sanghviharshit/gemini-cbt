# gemini-cbt
Plugin for starting up a [Cross Browser Testing](https://crossbrowsertesting.com) tunnel when running tests with Gemini

[![Build Status](https://travis-ci.org/sanghviharshit/gemini-cbt.svg?branch=master)](https://travis-ci.org/sanghviharshit/gemini-cbt)

> Based on original source code from https://github.com/Saulis/gemini-browserstack

## Requirements
Works with [gemini](https://github.com/gemini-testing/gemini) [v1.0.0](https://github.com/gemini-testing/gemini/releases/tag/v1.0.0) or later.

## Installation
`npm install sanghviharshit/gemini-cbt`

## Configuration
- __username__ (optional) sets the username for CBT. Defaults to environmental variable CBT_USERNAME
- __accessKey__ (optional) sets the accesskey for CBT. Defaults to environmental variable CBT_ACCESS_KEY

Example configuration for your `.gemini.yml`

```yml
rootUrl: http://localhost:8080/home
gridUrl: http://this.address.is.ignored/so-anything-goes

system:
  plugins:
    cbt:
      username: foo
      accessKey: bar

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
