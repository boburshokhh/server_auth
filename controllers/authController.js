import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Регистрация пользователя
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1️⃣ Проверяем, что все данные переданы
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Все поля обязательны" });
    }
    // 2️⃣ Проверяем, есть ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email уже используется" });
    }
    // 3️⃣ Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    // 4️⃣ Создаем пользователя в базе данных
    const user = await User.create({ name, email, password: hashedPassword });
    // 5️⃣ Генерируем JWT-токен
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Пользователь создан", token, user });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: "Ошибка регистрации" });
  }
}

// 🔹 Авторизация пользователя
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Неверные учетные данные" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Ошибка авторизации" });
  }
};

// 🔹 Получение профиля (только для авторизованных)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения профиля" });
  }
};
