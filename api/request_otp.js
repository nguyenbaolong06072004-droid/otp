export default async function handler(req, res) {
  // Tạo OTP 6 chữ số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expire = Date.now() + 60000; // 60s

  // Lưu tạm OTP (demo). Production nên hash + dùng DB/Redis.
  globalThis.otp_data = { otp, expire };

  // Lấy BOT token và CHAT_ID từ ENV (an toàn)
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "MISSING_TELEGRAM_CONFIG" });
  }

  const message = `🔐 OTP của bạn: *${otp}*\n⏳ Hiệu lực: 60 giây`;

  // Gọi Telegram API
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: "TELEGRAM_ERROR", detail: text });
    }

    return res.status(200).json({ status: "OTP_SENT", expire });
  } catch (e) {
    return res.status(500).json({ error: "SEND_FAILED", detail: e.toString() });
  }
}
