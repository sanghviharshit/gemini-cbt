# gemini-cbt
Plugin for starting up a [Cross Browser Testing](crossbrowsertesting.com) tunnel when running tests with Gemini

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
  ie11:
    desiredCapabilities:
      os: "WINDOWS"
      os_version: "7"
      browserName: "internet explorer"
      version: "11"

  chrome43:
    desiredCapabilities:
      os: "WINDOWS"
      os_version: "10"
      browserName: "chrome"
      version: "43"
```
