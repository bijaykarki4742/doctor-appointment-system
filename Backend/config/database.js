import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection to mongo established.");
    } catch (err) {
        console.error("Connection to MongoDB failed:", err.message);
        process.exit(1);
    }
}

export default connectDB;