import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
    minLength: [5, "Email must be at least 5 characters"],
    maxLength: [30, "Email cannot exceed 30 characters"]
  },
  password: {
    type: String,
    required: true,
    minlength: [8,"Password must be at least 8 characters"],
    select: false // Never return password in queries
  },
  role: {
    type: String,
    enum: ["patient", "doctor","admin"],
    required: true,
    default:"patient"
  },
  isSuperAdmin: {  // 👈 Flag for full-access admins
    type: Boolean,
    default: false
  },
  refreshToken: { type: String } // For JWT rotation
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);