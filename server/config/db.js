const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL)
        console.log(`Mongo Db Connected: ${connect.connection.host}`)
    } catch(err) {
        console.log(`Error: ${err.message}`);
        process.exit();
    }
}

module.exports = connectDB;