'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")


const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class accessService {
  /* Check this token used? */
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    if (foundToken) {
      // decode 
      const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log({userId, email})

      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls relogin')
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered')

    // verify token
    const {userId, email} = await verifyJWT(holderToken, foundToken.privateKey)

    // check UserId
    const foundShop = await findByEmail({email})
    console.log('[2]::::', {userId, email})
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    // create a pair
    const tokens =  await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)


    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken // used to get new token
      }
    })

    return {
      user: {userId, email},
      tokens
    }

  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log(`delKey ::`, delKey)
    return delKey
  }

  static login = async ({email, password, refreshToken = null}) => {

    // 1. find shop
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError('Shop not registerd!')
    }

    // 2. match password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')

    // 3. create token
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4. generate token
    const {_id: userId} = foundShop;
    const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey, userId
    })

    return {
      shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
      tokens
    
    }

  }

  static signUp = async ({name, email, password}) => {
    // try {
      // Step1: Check email exist?
      const hodelShop = await shopModel.findOne({email}).lean()

      if (hodelShop) {
        throw new BadRequestError('Error: Shop already registered!')
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // Public key CryptoGraphy Standards

        console.log({privateKey, publicKey}) // save collection keyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          // throw new BadRequestError('Error: Shop already registered!')
          return {
            code: 'xxx',
            message: 'keyStore errors'
          }
        } 

        // create token pair
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
        console.log(`Created Token Success::`, tokens)

        return {
          code: 201,
          metadata: {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }

    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error'
    //   }
    // }
  }

}

module.exports = accessService