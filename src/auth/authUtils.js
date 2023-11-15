'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  X_CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access Token
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days'
    })

    // 

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.err(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })
    return {accessToken, refreshToken}
  } catch (error) {
    console.error(`createTokenPair error:: `, error)
  }
}

const authentication = asyncHandler(async (req, res, next) => {

  // 1. check userId missing??
  const userId = req.headers[HEADER.X_CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  // 2. get accessToken
  const keyStore = await findByUserId(userId)
  console.log(`keyStore`, keyStore)
  if (!keyStore) throw new NotFoundError('Not found keystore')

  // 3. verify Token
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  console.log(`accesstoken`, accessToken)
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    console.log(`decodeUser`, decodeUser)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId!')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    // throw error
    console.log(`1`, error)
  }
 
  // 

})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}