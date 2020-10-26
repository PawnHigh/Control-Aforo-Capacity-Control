const express = require('express')
const router = express.Router()

const { getAforo, setAforo, updateAforo } = require('../controllers/aforo.controller')

router.get('/', getAforo)
router.post('/post', setAforo)
router.put('/update/:id', updateAforo)

module.exports = router