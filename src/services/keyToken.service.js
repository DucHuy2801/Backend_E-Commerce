'use strict'

const keyTokenModel = require('../models/keytoken.model')
const {Types} = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
    try {
      // level 0
        // const tokens = await keyTokenModel.create({
        //   user: userId,
        //   publicKey,
        //   privateKey
        // })

        // return tokens ? tokens.publicKey : null

      // level 1
      const filter = {user: userId}, update = {
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      }, options = {upsert: true, new: true}

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
        return error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshTokensUsed: refreshToken})
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshToken})
  }

  static removeKeyById = async (id) => {
    const result = await keyTokenModel.deleteOne(id)
    return result
  }

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({user: new Types.ObjectId(userId)})
    // return await keyTokenModel.deleteOne({user: userId})
  }

}

module.exports = KeyTokenService