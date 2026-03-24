const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

const connectToMongo = async() =>{
try{
    await mongoose.connect(URI);
    console.log("Server is connect successfully");
}catch(error){
    console.log("Connection fail");
    process.exit(0);
}
}

module.exports = connectToMongo;