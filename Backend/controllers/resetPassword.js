export const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  console.log('Received passwords:', { newPassword, confirmPassword }); // Add this line

  // Validate all required fields
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Enhanced password comparison
  if (newPassword.trim() !== confirmPassword.trim()) {
    console.log('Password mismatch details:', {
      newPasswordLength: newPassword.length,
      confirmPasswordLength: confirmPassword.length,
      newPasswordTrimmed: newPassword.trim(),
      confirmPasswordTrimmed: confirmPassword.trim()
    });
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

    // Set the new password (make sure your User model hashes this password)
    user.password = newPassword;

    // Clear OTP and expiration time
    user.otp = undefined;
    user.otpExpire = undefined;

    // Save the user
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset' });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message // Send more detailed error to frontend for debugging
    });
  }
};
