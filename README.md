<div style="text-align: center;" align="center">

# egg-http-proxy-plus

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]
[![Node.js Version][node-image]][node-url]
[![CI](https://github.com/saqqdy/egg-http-proxy-plus/workflows/Node.js%20CI/badge.svg)](https://github.com/saqqdy/egg-http-proxy-plus/actions)

> A powerful HTTP proxy middleware plugin for Egg.js with TypeScript support

**中文文档** | [English](#english)

Built on top of [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware).

**[📝 Changelog](CHANGELOG.md)** | **[📦 Examples](examples/proxy-demo/)** | **[🐛 Issues](https://github.com/saqqdy/egg-http-proxy-plus/issues)**

---

## Features

| Feature | Description |
|---------|-------------|
| 📁 File Upload | Built-in multipart/form-data support |
| 🔧 Custom Matching | Function-based path matching |
| 🔄 ctx Passing | Access Egg.js context in callbacks |
| 📘 TypeScript | Built-in type definitions |
| 🔌 WebSocket | WS proxy support |
| ✏️ Path Rewrite | Flexible rewrite rules |
| 🛡️ Error Handling | Custom error callbacks |

## Requirements

| Dependency | Version |
|------------|---------|
| Node.js | >= 14.0.0 |
| Egg.js | >= 3.0.0 |

## Installation

```bash
npm i egg-http-proxy-plus
# or
pnpm add egg-http-proxy-plus
# or
yarn add egg-http-proxy-plus
```

## Quick Start

### 1. Enable Plugin

```js
// config/plugin.js
exports.httpProxyPlus = {
  enable: true,
  package: 'egg-http-proxy-plus'
}
```

### 2. Configure Proxy

```js
// config/config.default.js
exports.httpProxyPlus = {
    '/api': 'http://backend.example.com'
}
```

### 3. Test

```bash
curl http://localhost:7001/api/users
# Proxies to http://backend.example.com/api/users
```

## Configuration Examples

### Basic

```js
// Object form
exports.httpProxyPlus = {
    '/api': 'http://backend.example.com',
    '/v1': {
        target: 'http://backend.example.com',
        pathRewrite: { '^/v1': '/api/v1' }
    }
}

// Array form
exports.httpProxyPlus = [
    { origin: '/api', options: 'http://backend.example.com' },
    { origin: '/v1', options: { target: 'http://backend.example.com' } }
]
```

### Path Rewrite

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://backend.example.com',
        pathRewrite: { '^/api': '' }  // Remove /api prefix
    }
}
// /api/users -> http://backend.example.com/users
```

### Custom Matching

```js
exports.httpProxyPlus = [
    {
        // Match GET requests only
        origin(pathname, req) {
            return pathname.startsWith('/api') && req.method === 'GET'
        },
        options: { target: 'http://backend.example.com' }
    }
]
```

### Add Auth Header

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://backend.example.com',
        onProxyReq(proxyReq, req, res, ctx) {
            const token = ctx.cookies.get('access_token')
            if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`)
            }
        }
    }
  }
}
```

### Response Modification

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://backend.example.com',
        onProxyRes(proxyRes, req, res, ctx) {
            proxyRes.headers['x-proxy-by'] = 'egg-http-proxy-plus'
        }
    }
}
```

### Error Handling

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://backend.example.com',
        onError(err, req, res) {
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
                code: 502,
                message: 'Bad Gateway',
                error: err.message
            }))
        }
    }
}
```

### WebSocket Proxy

```js
exports.httpProxyPlus = {
    '/ws': {
        target: 'ws://backend.example.com',
        ws: true
    }
}
```

### Multiple Services

```js
exports.httpProxyPlus = {
    '/api/users': 'http://users-service:3001',
    '/api/orders': 'http://orders-service:3002',
    '/api/products': 'http://products-service:3003'
}
```

## API Reference

### ProxyConfigItem

| Property | Type | Required | Description |
|----------|------|:--------:|-------------|
| `origin` | `string \| string[] \| Function` | ✓ | Path pattern to match |
| `options` | `string \| ExtendedProxyOptions` | ✓ | Proxy options or target URL |

### ExtendedProxyOptions

| Property | Type | Required | Description |
|----------|------|:--------:|-------------|
| `target` | `string` | ✓ | Target URL |
| `pathRewrite` | `object` | | Path rewrite rules |
| `changeOrigin` | `boolean` | | Change origin header (default: false) |
| `onProxyReq` | `Function` | | Request callback (4th arg: ctx) |
| `onProxyRes` | `Function` | | Response callback (4th arg: ctx) |
| `onError` | `Function` | | Error callback |
| `ws` | `boolean` | | WebSocket proxy (default: false) |
| `proxyTimeout` | `number` | | Timeout in milliseconds |

For more options, see [http-proxy-middleware docs](https://github.com/chimurai/http-proxy-middleware#options).

## TypeScript

Built-in type definitions:

```ts
// config/config.default.ts
import { EggAppConfig } from 'egg'

export default () => {
    const config: EggAppConfig = {}
    config.httpProxyPlus = {
        '/api': {
            target: 'http://backend.example.com',
            pathRewrite: { '^/api': '' },
            onProxyReq(proxyReq, req, res, ctx) {
                const token = ctx.cookies.get('token')
                token && proxyReq.setHeader('Authorization', token)
            }
        }
    }
    return config
}
```

## FAQ

<details>
<summary><b>How to proxy file uploads?</b></summary>

Built-in support, no extra configuration needed.
</details>

<details>
<summary><b>How are POST request bodies handled?</b></summary>

The plugin automatically handles `rawBody` for proper forwarding.
</details>

<details>
<summary><b>How to debug proxy requests?</b></summary>

```js
onProxyReq(proxyReq, req, res, ctx) {
    console.log('[Proxy]', req.method, req.url, '->', proxyReq.path)
}
onProxyRes(proxyRes, req, res) {
    console.log('[Response]', proxyRes.statusCode)
}
```
</details>

<details>
<summary><b>How to skip certain requests?</b></summary>

Return `false` in custom matching function:
```js
origin(pathname, req) {
    if (pathname === '/health') return false
    return pathname.startsWith('/api')
}
```
</details>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

---

[npm-image]: https://img.shields.io/npm/v/egg-http-proxy-plus.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-http-proxy-plus
[download-image]: https://img.shields.io/npm/dm/egg-http-proxy-plus.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-http-proxy-plus
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: LICENSE
[node-image]: https://img.shields.io/node/v/egg-http-proxy-plus.svg?style=flat-square
