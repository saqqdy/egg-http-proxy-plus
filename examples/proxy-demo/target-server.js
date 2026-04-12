/**
 * Target server - Mock backend API
 * Usage: node target-server.js
 */
'use strict'

const express = require('express')
const app = express()

app.use(express.json())

// CORS support
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

// Home page
app.get('/', (req, res) => {
    res.json({
        message: 'Target Server Running',
        timestamp: Date.now()
    })
})

// User list
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

// Get single user
app.get('/users/:id', (req, res) => {
    const { id } = req.params
    res.json({
        code: 0,
        data: { id: Number(id), name: `User ${id}`, email: `user${id}@example.com` }
    })
})

// Create user
app.post('/users', (req, res) => {
    const { name, email } = req.body
    res.json({
        code: 0,
        message: 'User created',
        data: { id: Date.now(), name, email }
    })
})

// Get request headers info
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

// Delayed response (test timeout)
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

// Error response
app.get('/error', (req, res) => {
    res.status(500).json({
        code: 500,
        message: 'Internal Server Error from Target'
    })
})

// File upload simulation
app.post('/upload', (req, res) => {
    res.json({
        code: 0,
        message: 'File uploaded successfully',
        size: req.headers['content-length'],
        contentType: req.headers['content-type']
    })
})

// WebSocket info
app.get('/ws-info', (req, res) => {
    res.json({
        code: 0,
        message: 'Use ws://localhost:4000/ws for WebSocket connection'
    })
})

const PORT = 4000
app.listen(PORT, () => {
    console.info(`Target server running at http://localhost:${PORT}`)
    console.info('\nAvailable endpoints:')
    console.info('  GET  /              - Server info')
    console.info('  GET  /users         - Get all users')
    console.info('  GET  /users/:id     - Get user by ID')
    console.info('  POST /users         - Create user')
    console.info('  GET  /headers       - Get request headers')
    console.info('  GET  /slow?delay=N  - Slow response (test timeout)')
    console.info('  GET  /error         - Error response')
    console.info('  POST /upload        - File upload simulation')
})
