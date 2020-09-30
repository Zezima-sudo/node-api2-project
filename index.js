const express = require('express')
const server = express()
const endpoints = require('./hubs/endpoints')
server.use(express.json())
server.use('/api', endpoints)
const port = 3000

server.listen(port, () => {
    console.log(`server listening on port:${port}`)
})


server.get('/', (req, res) => {
    res.status(200).json({
        api: 'running',
        query: req.query
    })
})



