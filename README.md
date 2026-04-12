# egg-http-proxy-plus

[English](#english) | [中文](#中文)

---

<a name="中文"></a>

## 中文

功能强大的 Egg.js HTTP 代理中间件插件。支持转发文件上传接口、自定义匹配方法、ctx 透传、TypeScript 类型支持。

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]
[![Node.js Version][node-image]][node-url]

基于 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 构建。

## 特性

- ✅ 支持文件上传代理
- ✅ 支持自定义路径匹配函数
- ✅ ctx 上下文透传到回调函数
- ✅ TypeScript 类型定义
- ✅ 支持WebSocket 代理
- ✅ 支持路径重写
- ✅ 支持请求/响应修改

## 环境要求

- Node.js >= 14.0.0
- Egg.js >= 3.0.0

## 安装

```bash
# npm
npm i egg-http-proxy-plus --save

# yarn
yarn add egg-http-proxy-plus

# pnpm
pnpm add egg-http-proxy-plus
```

## 使用方法

### 启用插件

```js
// {app_root}/config/plugin.js
exports.httpProxyPlus = {
    enable: true,
    package: 'egg-http-proxy-plus'
}
```

## 配置示例

### 基础配置

```js
// {app_root}/config/config.default.js
exports.httpProxyPlus = {
    '/api': 'http://www.example.org'
}
```

请求 `/api/users` 将被代理到 `http://www.example.org/api/users`

### 路径重写

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        pathRewrite: { '^/api': '' }
    }
}
```

请求 `/api/users` 将被代理到 `http://www.example.org/users`

### 数组配置方式

```js
exports.httpProxyPlus = [
    {
        origin: '/api',
        options: {
            target: 'http://www.example.org',
            pathRewrite: { '^/api': '' }
        }
    }
]
```

### 自定义匹配函数

```js
exports.httpProxyPlus = [
    {
        // 仅匹配 GET 请求
        origin(pathname, req) {
            return pathname.match('^/api') && req.method === 'GET'
        },
        options: {
            target: 'http://www.example.org'
        }
    }
]
```

### 请求拦截 - 添加认证头

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        onProxyReq(proxyReq, req, res, ctx) {
            // ctx 上下文透传，可访问 cookies、session 等
            const token = ctx.cookies.get('access_token')
            if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`)
            }
        }
    }
}
```

### 响应修改

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        onProxyRes(proxyRes, req, res, ctx) {
            // 添加自定义响应头
            proxyRes.headers['x-proxy-by'] = 'egg-http-proxy-plus'
            // 可根据 ctx 做条件处理
            if (ctx.state.user) {
                proxyRes.headers['x-user-id'] = ctx.state.user.id
            }
        }
    }
}
```

### 错误处理

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        onError(err, req, res) {
            console.error('Proxy error:', err)
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

### WebSocket 代理

```js
exports.httpProxyPlus = {
    '/ws': {
        target: 'ws://www.example.org',
        ws: true// 启用 WebSocket 代理
    }
}
```

### 多目标代理

```js
exports.httpProxyPlus = {
    '/api/users': 'http://users-service:3001',
    '/api/orders': 'http://orders-service:3002',
    '/api/products': 'http://products-service:3003'
}
```

## TypeScript 支持

插件内置 TypeScript 类型定义：

```ts
// {app_root}/config/config.default.ts
import { EggAppConfig } from 'egg'

export default () => {
    const config: EggAppConfig = {}
    config.httpProxyPlus = {
        '/api': {
            target: 'http://www.example.org',
            pathRewrite: { '^/api': '' },
            onProxyReq(proxyReq, req, res, ctx) {
                // 完整的类型提示
                const token = ctx.cookies.get('token')
                token && proxyReq.setHeader('Authorization', token)
            }
        }
    }
    return config
}
```

## API 参考

### ProxyConfigItem

| 属性 | 类型 | 说明 |
|------|------|------|
| `origin` | `string \| string[] \| Function` | 路径匹配模式 |
| `options` | `string \| ExtendedProxyOptions` | 代理配置或目标 URL |

### ExtendedProxyOptions

| 属性 | 类型 | 说明 |
|------|------|------|
| `target` | `string` | 代理目标地址 |
| `pathRewrite` | `object` | 路径重写规则 |
| `changeOrigin` | `boolean` | 是否修改请求头的 origin |
| `onProxyReq` | `Function` | 代理请求回调，第四个参数为 ctx |
| `onProxyRes` | `Function` | 代理响应回调，第四个参数为 ctx |
| `onError` | `Function` | 错误回调 |
| `ws` | `boolean` | 是否启用 WebSocket 代理 |

更多配置选项请参考 [http-proxy-middleware 文档](https://github.com/chimurai/http-proxy-middleware#options)。

## 常见问题

### 如何代理文件上传？

插件已内置处理文件上传的支持，无需额外配置。

### 如何处理 POST 请求体？

插件会自动处理 `rawBody`，确保 POST/PUT 请求体正确转发。

### 如何调试代理请求？

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        onProxyReq(proxyReq, req, res, ctx) {
            console.log('[Proxy]', req.method, req.url, '->', proxyReq.path)
        },
        onProxyRes(proxyRes, req, res) {
            console.log('[Proxy Response]', proxyRes.statusCode)
        }
    }
}
```

## 问题反馈

请到 [GitHub Issues](https://github.com/saqqdy/egg-http-proxy-plus/issues) 提交问题或建议。

## License

[MIT](LICENSE)

---

<a name="english"></a>

## English

A powerful HTTP proxy middleware plugin for Egg.js. Supports file upload proxying, custom matching methods, ctx context passing, and TypeScript type definitions.

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

Built on top of [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware).

## Features

- ✅ File upload proxy support
- ✅ Custom path matching functions
- ✅ ctx context passed to callbacks
- ✅ TypeScript type definitions
- ✅ WebSocket proxy support
- ✅ Path rewrite support
- ✅ Request/response modification

## Requirements

- Node.js >= 14.0.0
- Egg.js >= 3.0.0

## Installation

```bash
# npm
npm i egg-http-proxy-plus --save

# yarn
yarn add egg-http-proxy-plus

# pnpm
pnpm add egg-http-proxy-plus
```

## Usage

### Enable Plugin

```js
// {app_root}/config/plugin.js
exports.httpProxyPlus = {
    enable: true,
    package: 'egg-http-proxy-plus'
}
```

## Configuration Examples

### Basic Configuration

```js
// {app_root}/config/config.default.js
exports.httpProxyPlus = {
    '/api': 'http://www.example.org'
}
```

A request to `/api/users` will proxy to `http://www.example.org/api/users`

### Path Rewrite

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        pathRewrite: { '^/api': '' }
    }
}
```

A request to `/api/users` will proxy to `http://www.example.org/users`

### Custom Matching Function

```js
exports.httpProxyPlus = [
    {
        origin(pathname, req) {
            return pathname.match('^/api') && req.method === 'GET'
        },
        options: {
            target: 'http://www.example.org'
        }
    }
]
```

### Request Interception - Add Auth Header

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://www.example.org',
        onProxyReq(proxyReq, req, res, ctx) {
            const token = ctx.cookies.get('access_token')
            if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`)
            }
        }
    }
}
```

### WebSocket Proxy

```js
exports.httpProxyPlus = {
    '/ws': {
        target: 'ws://www.example.org',
        ws: true
    }
}
```

## API Reference

### ProxyConfigItem

| Property | Type | Description |
|----------|------|-------------|
| `origin` | `string \| string[] \| Function` | Path pattern to match |
| `options` | `string \| ExtendedProxyOptions` | Proxy options or target URL |

### ExtendedProxyOptions

| Property | Type | Description |
|----------|------|-------------|
| `target` | `string` | Target URL to proxy to |
| `pathRewrite` | `object` | Path rewrite rules |
| `changeOrigin` | `boolean` | Change origin header |
| `onProxyReq` | `Function` | Proxy request callback with ctx |
| `onProxyRes` | `Function` | Proxy response callback with ctx |
| `onError` | `Function` | Error callback |
| `ws` | `boolean` | Enable WebSocket proxy |

For more options, see [http-proxy-middleware documentation](https://github.com/chimurai/http-proxy-middleware#options).

## Questions & Suggestions

Please open an issue [here](https://github.com/saqqdy/egg-http-proxy-plus/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/egg-http-proxy-plus.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-http-proxy-plus
[download-image]: https://img.shields.io/npm/dm/egg-http-proxy-plus.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-http-proxy-plus
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: LICENSE
[node-image]: https://img.shields.io/node/v/egg-http-proxy-plus.svg?style=flat-square
[node-url]: https://nodejs.org/en/
