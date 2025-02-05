import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import "express-async-errors"; // Позволяет ловить ошибки в async-функциях
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js"; // Добавляем emailRoutes
import sequelize from "./config/database.js";
import logger from "./middleware/logger.js";

dotenv.config();
const app = express();

// 🔹 Настройки безопасности и производительности
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(helmet());
app.use(compression()); // Сжатие ответов для ускорения работы API
app.use(express.json());

// 🔹 Ограничение частоты запросов (Защита от DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Макс. 100 запросов с одного IP за 15 минут
  message: "Слишком много запросов, попробуйте позже",
});
app.use(limiter);

// 🔹 Подключаем маршруты
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

// 🔹 Обработка несуществующих маршрутов (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// 🔹 Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

export default app;
