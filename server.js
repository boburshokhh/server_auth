import app from "./app.js";
import sequelize from "./config/database.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

sequelize.sync().then(() => {
  console.log("✅ База данных синхронизирована");

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Сервер запущен: http://${HOST}:${PORT}`);
  });
});
