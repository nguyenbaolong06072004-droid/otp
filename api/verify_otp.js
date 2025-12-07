export default function handler(req, res) {
  const { otp } = req.body || {};

  if (!globalThis.otp_data) return res.status(200).json({ error: "NO_OTP" });

  const { otp: realOtp, expire } = globalThis.otp_data;

  if (Date.now() > expire) return res.status(200).json({ error: "OTP_EXPIRED" });

  if (!otp) return res.status(400).json({ error: "MISSING_OTP" });

  if (otp !== realOtp) return res.status(200).json({ error: "WRONG_OTP" });

  // Khi thành công, xóa OTP để đảm bảo one-time
  delete globalThis.otp_data;

  return res.status(200).json({ status: "OK" });
}
