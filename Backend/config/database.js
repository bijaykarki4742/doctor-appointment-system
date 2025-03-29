import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://np03cs4a230091:dbUserPw69@doctorappointmentcluste.u2anr.mongodb.net/?retryWrites=true&w=majority&appName=doctorAppointmentCluster');
        console.log("Connection to mongo established.");
    } catch (err) {
        console.error("Connection to MongoDB failed:", err.message);
        process.exit(1);
    }
}


export default connectDB;