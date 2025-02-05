import { sendVerificationEmail } from "./utils/emailService.js";

sendVerificationEmail("samanihalab@gmail.com", "123456")
  .then(() => console.log("✅ Email отправлен"))
  .catch((err) => console.error("❌ Ошибка:", err));
