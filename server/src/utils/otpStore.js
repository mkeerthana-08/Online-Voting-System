const otpStore = new Map();

const getExpiryMs = () => {
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);
  return expiryMinutes * 60 * 1000;
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const setOtpForVoter = (voterId) => {
  const otp = generateOtp();
  otpStore.set(voterId, {
    otp,
    verified: false,
    expiresAt: Date.now() + getExpiryMs(),
  });
  return otp;
};

const verifyOtpForVoter = (voterId, otp) => {
  const entry = otpStore.get(voterId);
  if (!entry) {
    return { ok: false, reason: "OTP not generated" };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(voterId);
    return { ok: false, reason: "OTP expired" };
  }

  if (entry.otp !== otp) {
    return { ok: false, reason: "Invalid OTP" };
  }

  entry.verified = true;
  otpStore.set(voterId, entry);
  return { ok: true };
};

const isOtpVerified = (voterId) => {
  const entry = otpStore.get(voterId);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(voterId);
    return false;
  }
  return entry.verified;
};

const clearOtpForVoter = (voterId) => {
  otpStore.delete(voterId);
};

module.exports = {
  setOtpForVoter,
  verifyOtpForVoter,
  isOtpVerified,
  clearOtpForVoter,
};
