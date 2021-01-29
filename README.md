# egg-http-proxy-plus

### 支持转发文件上传接口，支持自定义匹配方法，ctx透传


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-http-proxy-plus.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-http-proxy-plus
[travis-image]: https://travis-ci.org/saqqdy/egg-http-proxy-plus.svg?branch=master
[travis-url]: https://travis-ci.org/saqqdy/egg-http-proxy-plus
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/egg-http-proxy-plus.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/egg-http-proxy-plus?branch=master
[david-image]: https://img.shields.io/david/saqqdy/egg-http-proxy-plus.svg?style=flat-square
[david-url]: https://david-dm.org/saqqdy/egg-http-proxy-plus
[snyk-image]: https://snyk.io/test/npm/egg-http-proxy-plus/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-http-proxy-plus
[download-image]: https://img.shields.io/npm/dm/egg-http-proxy-plus.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-http-proxy-plus

Configure proxy middleware for egg. Use [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware).

## Install

```bash
# use npm
$ npm i egg-http-proxy-plus --save

# use yarn
$ yarn add egg-http-proxy-plus
```

## Usage

```js
// {app_root}/config/plugin.js
exports.httpProxyPlus = {
  enable: true,
  package: 'egg-http-proxy-plus',
};
```

## Configuration

#### Proxy `/api` requests to `http://www.example.org`:

```js
// {app_root}/config/config.default.js
exports.httpProxyPlus = {
  '/api': 'http://www.example.org'
};
// or
exports.httpProxyPlus = [
  {
    origin: '/api',
    options: 'http://www.example.org'
  }
];
```

#### A request to `/api/users` will now proxy the request to `http://www.example.org/api/users`.

If you don't want `/api` to be passed along, we need to rewrite the path:

```js
// {app_root}/config/config.default.js
exports.httpProxyPlus = {
  '/api': {
    target: 'http://www.example.org',
    pathRewrite: {'^/api' : ''}
  }
};
// or
exports.httpProxyPlus = [
  {
    origin: '/api',
    options: {
      target: 'http://www.example.org',
      pathRewrite: {'^/api' : ''}
      // ...
    }
  }
];
```

#### custom matching

For full control you can provide a custom function to determine which requests should be proxied or not.

```js
// {app_root}/config/config.default.js
exports.httpProxyPlus = [
  {
    origin(pathname, req) {
      return pathname.match('^/api') && req.method === 'GET';
    },
    options: {}
  }
];
```

#### http-proxy events

Pay attention to the fourth parameter, the plug-in transparently transmits the ctx context

```js
// {app_root}/config/config.default.js
exports.httpProxyPlus = {
  '/api': {
    target: 'http://www.example.org',
    onProxyReq(proxyReq, req, res, ctx) {
      if (req.method.toLowerCase() === 'post') {
        const token = ctx.cookies.get('access_token')
        token && proxyReq.setHeader('authorization', token)
      }
    }
  }
};
```


For more advanced usages, checkout [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#options) options documentation.

## Questions & Suggestions

Please open an issue [here](https://github.com/saqqdy/egg-http-proxy-plus/issues).

## License

[MIT](LICENSE)
