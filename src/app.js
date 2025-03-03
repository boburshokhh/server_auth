import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => res.send("API работает!"));

app.listen(process.env.PORT, () =>
  console.log(`Сервер запущен на порту ${process.env.PORT}`)
);
