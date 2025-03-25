import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    contact: String,
    specialty: String,
    license: String
});
const User = mongoose.model('User', userSchema);

export { User };