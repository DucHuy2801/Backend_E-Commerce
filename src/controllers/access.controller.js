'use strict'

const AccessService = require("../services/access.service")
const {OK, CREATED, SuccessResponse} = require("../core/success.response")
const { BadRequestError } = require("../core/error.response")

class AccessController {

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout({keyStore: req.keyStore})
    }).send(res)
  }

  login = async (req, res, next) => {
    const { email } = req.body
    if (!email)
      throw new BadRequestError("missing email")
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

module.exports = new AccessController()