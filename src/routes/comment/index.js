'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()
const { asyncHandler} = require('../../helpers/asyncHandler')

router.post("", asyncHandler(commentController.createComment))
router.get("", asyncHandler(commentController.getCommentsByParentId))

module.exports = router