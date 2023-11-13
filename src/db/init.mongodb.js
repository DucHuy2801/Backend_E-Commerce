'use strict'

const mongoose = require('mongoose');
const {db: {host, name, port}} = require('../config/config.mongodb')
// const connectString = `mongodb://${host}:${port}/${name}`
const connectString = 'mongodb+srv://theflash28012002:duchuy28012002@cluster0.i9egyo8.mongodb.net/'

// const connectString = `mongodb://0.0.0.0:${port}/${name}`

// const {countConnect} = require('../helpers/check.connect')

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb'){
        // if (1 === 1) {
        //     mongoose.set('debug', true)
        //     mongoose.set('debug', {color: true})
        // }

        // ...

        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(_ => {
            console.log(`Connect to MongoDB successfully`);
        }).catch(err => {
            // console.error(`Error connecting to MongoDB: ${err}`);
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