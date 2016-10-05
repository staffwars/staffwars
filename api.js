/**
 * Web APIの実装部分
 */
const express = require('express')
const request = require('request')

const router = express.Router()

router.post('/button', (req, res, next) => {
  res.json({
    result: "not implementation"
  })
})

module.exports = router
