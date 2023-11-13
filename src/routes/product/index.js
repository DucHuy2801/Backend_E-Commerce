'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authenticationV2 } = require('../../auth/authUtils')


// authentication
// router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))

module.exports = router