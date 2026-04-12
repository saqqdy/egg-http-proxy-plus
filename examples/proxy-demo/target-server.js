/**
 * 目标服务器 - 模拟后端 API
 * 启动: node target-server.js
 */
'use strict'

const express = require('express')
const app = express()

app.use(express.json())

// CORS 支持
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

// 首页
app.get('/', (req, res) => {
    res.json({
        message: 'Target Server Running',
        timestamp: Date.now()
    })
})

// 用户列表
app.get('/users', (req, res) => {
    res.json({
        code: 0,
        data: [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
            { id: 3, name: 'Charlie', email: 'charlie@example.com' }
        ]
    })
})

// 获取单个用户
app.get('/users/:id', (req, res) => {
    const { id } = req.params
    res.json({
        code: 0,
        data: { id: Number(id), name: `User ${id}`, email: `user${id}@example.com` }
    })
})

// 创建用户
app.post('/users', (req, res) => {
    const { name, email } = req.body
    res.json({
        code: 0,
        message: 'User created',
        data: { id: Date.now(), name, email }
    })
})

// 获取请求头信息
app.get('/headers', (req, res) => {
    res.json({
        code: 0,
        data: {
            authorization: req.headers.authorization || null,
            'x-custom': req.headers['x-custom'] || null,
            'x-forwarded-for': req.headers['x-forwarded-for'] || null,
            'user-agent': req.headers['user-agent'],
            allHeaders: req.headers
        }
    })
})

// 延迟响应（测试超时）
app.get('/slow', (req, res) => {
    const delay = Number(req.query.delay) || 2000
    setTimeout(() => {
        res.json({
            code: 0,
            message: `Delayed ${delay}ms`,
            timestamp: Date.now()
        })
    }, delay)
})

// 错误响应
app.get('/error', (req, res) => {
    res.status(500).json({
        code: 500,
        message: 'Internal Server Error from Target'
    })
})

// 文件上传模拟
app.post('/upload', (req, res) => {
    res.json({
        code: 0,
        message: 'File uploaded successfully',
        size: req.headers['content-length'],
        contentType: req.headers['content-type']
    })
})

// WebSocket 信息
app.get('/ws-info', (req, res) => {
    res.json({
        code: 0,
        message: 'Use ws://localhost:4000/ws for WebSocket connection'
    })
})

const PORT = 4000
app.listen(PORT, () => {
    console.log(`🎯 Target server running at http://localhost:${PORT}`)
    console.log('\nAvailable endpoints:')
    console.log('  GET  /              - Server info')
    console.log('  GET  /users         - Get all users')
    console.log('  GET  /users/:id     - Get user by ID')
    console.log('  POST /users         - Create user')
    console.log('  GET  /headers       - Get request headers')
    console.log('  GET  /slow?delay=N  - Slow response (test timeout)')
    console.log('  GET  /error         - Error response')
    console.log('  POST /upload        - File upload simulation')
})
