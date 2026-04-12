# egg-http-proxy-plus 集成测试示例

本示例演示如何使用 egg-http-proxy-plus 进行HTTP 代理。

## 快速开始

### 1. 安装依赖

```bash
# 在项目根目录
npm install

# 安装示例项目依赖
cd examples/proxy-demo/proxy-server
npm install
```

### 2. 启动目标服务器

```bash
# 在 examples/proxy-demo 目录
node target-server.js
```

目标服务器将在 http://localhost:4000 启动，提供以下接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 服务器信息 |
| GET | /users | 获取用户列表 |
| GET | /users/:id | 获取单个用户 |
| POST | /users | 创建用户 |
| GET | /headers | 查看请求头 |
| GET | /slow?delay=N | 延迟响应 |
| GET | /error | 错误响应 |
| POST | /upload | 文件上传 |

### 3. 启动代理服务器

```bash
# 在 examples/proxy-demo/proxy-server 目录
npm start
```

代理服务器将在 http://localhost:7001 启动。

### 4. 运行测试

```bash
# 在 examples/proxy-demo 目录
chmod +x test.sh
./test.sh
```

## 手动测试示例

### 基础代理测试

```bash
# 获取用户列表（通过代理）
curl http://localhost:7001/api/users

# 获取单个用户
curl http://localhost:7001/api/users/1

# 创建用户
curl -X POST http://localhost:7001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

### 请求头转发测试

```bash
# 查看转发的请求头
curl http://localhost:7001/api/headers \
  -H "X-Custom: my-custom-value"
```

### 认证测试

```bash
# 携带认证头
curl http://localhost:7001/api/auth/headers \
  -H "Authorization: Bearer my-token"
```

### 错误处理测试

```bash
# 测试错误响应
curl http://localhost:7001/api/error
```

### 超时测试

```bash
# 测试延迟响应（2秒）
curl http://localhost:7001/api/slow?delay=2000
```

### 文件上传测试

```bash
# 模拟文件上传
curl -X POST http://localhost:7001/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test.txt"
```

## 配置说明

代理配置位于 `proxy-server/config/config.default.js`：

```js
exports.httpProxyPlus = {
    '/api/users': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
    }
}
```

### 配置项说明

| 配置项 | 说明 |
|--------|------|
| `target` | 代理目标地址 |
| `pathRewrite` | 路径重写规则 |
| `changeOrigin` | 是否修改请求头的 origin |
| `onProxyReq` | 代理请求回调 |
| `onProxyRes` | 代理响应回调 |
| `onError` | 错误处理回调 |
| `proxyTimeout` | 代理超时时间 |

## 目录结构

```
proxy-demo/
├── target-server.js      # 目标服务器
├── proxy-server/         # 代理服务器
│   ├── package.json
│   ├── config/
│   │   ├── plugin.js     # 插件配置
│   │   └── config.default.js  # 代理配置
│   └── app/
│       ├── controller/
│       │   └── home.js
│       └── router.js
├── test.sh               # 测试脚本
└── README.md
```
