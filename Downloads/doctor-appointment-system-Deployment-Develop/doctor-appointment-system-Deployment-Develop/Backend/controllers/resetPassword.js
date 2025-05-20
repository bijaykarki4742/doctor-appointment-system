import User from '../models/Entity/usermodel.js';

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body; // Get email, OTP, newPassword, and confirmPassword from request

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches and if it has expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Set the new password
    user.password = newPassword;

    // Clear OTP and expiration time
    user.otp = undefined;
    user.otpExpire = undefined;

    // Save the updated user document with the new password
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset' });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
