'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const { asyncHandler} = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

// shopSignup
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
// router.post('/shop/logout', asyncHandler(accessController.logout))

// authentication
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router