import crypto from "crypto";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Используем Resend API
const resend = new Resend(process.env.RESEND_API_KEY);

// 📩 Функция отправки email
export const sendEmail = async (to, subject, html) => {
    try {
        if (process.env.EMAIL_PROVIDER === "resend") {
            // Отправка через Resend
            const { data, error } = await resend.emails.send({
                from: process.env.EMAIL_FROM,
                to: [to],
                subject,
                html,
            });
            if (error) throw new Error(error.message);
            return data;
        } else {
            // Отправка через SMTP (например, Gmail)
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `"Support" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });

            return { message: "Email отправлен" };
        }
    } catch (error) {
        console.error("❌ Ошибка отправки email:", error.message);
        throw new Error("Ошибка отправки email");
    }
};
