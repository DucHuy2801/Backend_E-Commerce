'use strict'

const mongoose = require('mongoose');
const connectString = process.env.MONGOOSE_URI
const MAX_POLL_SIZE = 50;
const TIME_OUT_CONNECT = 3000;

// const connectString = `mongodb://0.0.0.0:${port}/${name}`
// const connectString = `mongodb://${host}:${port}/${name}`
// const {countConnect} = require('../helpers/check.connect')
// const {db: {host, name, port}} = require('../config/config.mongodb')

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb'){
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectString, {
            serverSelectionTimeoutMS: TIME_OUT_CONNECT,
            maxPoolSize: MAX_POLL_SIZE
        }).then(_ => {
            console.log(`Connect to MongoDB successfully`);
        }).catch(err => {
            console.log(err)
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;