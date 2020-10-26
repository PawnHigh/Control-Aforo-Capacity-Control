const mongoose = require('mongoose')
const { Schema } = mongoose

const aforoData = new Schema({
    Capacity: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('aforo', aforoData)