# egg-http-proxy-plus

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]
[![Node.js Version][node-image]][node-url]
[![CI](https://github.com/saqqdy/egg-http-proxy-plus/workflows/Node.js%20CI/badge.svg)](https://github.com/saqqdy/egg-http-proxy-plus/actions)

> 功能强大的 Egg.js HTTP 代理中间件插件

[English](README.md) | **中文**

基于 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 构建。

**[📝 更新日志](CHANGELOG.md)** | **[📦 示例项目](examples/proxy-demo/)** | **[🐛 问题反馈](https://github.com/saqqdy/egg-http-proxy-plus/issues)**

## 目录

- [特性](#特性)
- [环境要求](#环境要求)
- [安装](#安装)
- [快速开始](#快速开始)
- [配置示例](#配置示例)
- [API 参考](#api-参考)
- [TypeScript](#typescript-支持)
- [常见问题](#常见问题)

## 特性

| 特性 | 说明 |
|------|------|
| 📁 文件上传代理 | 内置处理 multipart/form-data |
| 🔧 自定义匹配 | 支持函数式路径匹配 |
| 🔄 ctx 透传 | 回调函数可访问 Egg.js 上下文 |
| 📘 TypeScript | 内置类型定义文件 |
| 🔌 WebSocket | 支持 WS 代理 |
| ✏️ 路径重写 | 灵活的路径重写规则 |
| 🛡️ 错误处理 | 自定义错误回调 |

## 环境要求

| 依赖 | 版本 |
|------|------|
| Node.js | >= 14.0.0 |
| Egg.js | >= 3.0.0 |

## 安装

```bash
npm i egg-http-proxy-plus
# 或
pnpm add egg-http-proxy-plus
# 或
yarn add egg-http-proxy-plus
```

## 快速开始

### 1. 启用插件

```js
// config/plugin.js
exports.httpProxyPlus = {
    enable: true,
    package: 'egg-http-proxy-plus'
}
```

### 2. 配置代理

```js
// config/config.default.js
exports.httpProxyPlus = {
    '/api': 'http://backend.example.com'
}
```

### 3. 测试

```bash
curl http://localhost:7001/api/users
# 代理到 http://backend.example.com/api/users
```

## 配置示例

### 基础配置

```js
// 对象形式
exports.httpProxyPlus = {
    '/api': 'http://backend.example.com',
    '/v1': {
        target: 'http://backend.example.com',
        pathRewrite: { '^/v1': '/api/v1' }
    }
}

// 数组形式
exports.httpProxyPlus = [
    { origin: '/api', options: 'http://backend.example.com' },
    { origin: '/v1', options: { target: 'http://backend.example.com' } }
]
```

### 路径重写

```js
exports.httpProxyPlus = {
    '/api': {
        target: 'http://backend.example.com',
        pathRewrite: { '^/api': '' }  // 移除 /api 前缀
    }
}
// /api/users -> http://backend.example.com/users
```

### 自定义匹配

```js
exports.httpProxyPlus = [
    {
        // 仅匹配 GET 请求
        origin(pathname, req) {
            return pathname.startsWith('/api') && req.method === 'GET'
        },
        options: { target: 'http://backend.example.com' }
    }
]
```

### 添加认证头

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
```

### 响应修改

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

### 错误处理

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

### WebSocket 代理

```js
exports.httpProxyPlus = {
    '/ws': {
        target: 'ws://backend.example.com',
        ws: true
    }
}
```

### 多服务代理

```js
exports.httpProxyPlus = {
    '/api/users': 'http://users-service:3001',
    '/api/orders': 'http://orders-service:3002',
    '/api/products': 'http://products-service:3003'
}
```

## API 参考

### ProxyConfigItem

| 属性 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `origin` | `string \| string[] \| Function` | ✓ | 路径匹配模式 |
| `options` | `string \| ExtendedProxyOptions` | ✓ | 代理配置或目标 URL |

### ExtendedProxyOptions

| 属性 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `target` | `string` | ✓ | 代理目标地址 |
| `pathRewrite` | `object` | | 路径重写规则 |
| `changeOrigin` | `boolean` | | 修改请求头 origin (默认 false) |
| `onProxyReq` | `Function` | | 请求回调，第4个参数为 ctx |
| `onProxyRes` | `Function` | | 响应回调，第4个参数为 ctx |
| `onError` | `Function` | | 错误回调 |
| `ws` | `boolean` | | WebSocket 代理 (默认 false) |
| `proxyTimeout` | `number` | | 超时时间 (毫秒) |

更多选项参考 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#options)。

## TypeScript 支持

插件内置类型定义：

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

## 常见问题

<details>
<summary><b>如何代理文件上传？</b></summary>

插件已内置处理，无需额外配置。
</details>

<details>
<summary><b>POST 请求体如何处理？</b></summary>

插件自动处理 `rawBody`，确保请求体正确转发。
</details>

<details>
<summary><b>如何调试代理？</b></summary>

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
<summary><b>如何跳过某些请求？</b></summary>

使用自定义匹配函数返回 `false`：
```js
origin(pathname, req) {
    if (pathname === '/health') return false
    return pathname.startsWith('/api')
}
```
</details>

## 问题反馈

请到 [GitHub Issues](https://github.com/saqqdy/egg-http-proxy-plus/issues) 提交问题或建议。

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
