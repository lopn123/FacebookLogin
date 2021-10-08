import mongoose from "mongoose"

export default function mongooseInit()
{
    // mongoose.Promise = global.Promise;
    connect();
    mongoose.connection.on('disconnected', connect);
    require('../models/user');
}

function connect()
{
    mongoose.connect('mongodb://localhost:27017/test', (err) => {
        if(err)
        {
            console.log(err);
            throw err;
        }
        console.log('[mongoDB.js] MongoDB Connected');
    });
}