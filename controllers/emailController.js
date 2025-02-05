import crypto from "crypto";
import { User } from "../models/index.js";
import { sendEmail } from "../utils/emailService.js";

// 🔹 Генерация кода (6 цифр) и сохранение в БД
export const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Код истекает через 10 минут

    user.verificationCode = code;
    user.verificationCodeExpires = expiresAt;
    await user.save();

    await sendEmail(email, "Подтверждение email", `<p>Ваш код: <strong>${code}</strong></p>`);

    res.json({ message: "Код отправлен на email" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка отправки email" });
  }
};

// 🔹 Проверка кода
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.verificationCode || user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ error: "Код истек или не найден" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Неверный код" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ message: "Email подтвержден" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка подтверждения email" });
  }
};
