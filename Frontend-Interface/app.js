// Build server
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// Initializations
const app = express()

// Settings
app.set('port', process.env.PORT || 4000)

// Middleware
app.use(cors()) // Allow communication with other servers
app.use(morgan('dev')) // Show the web logs
app.use(express.json()) // Allow json format

// Routing
app.use('/api/aforo', require('./routes/aforo.routes'))

// Export
module.exports = app