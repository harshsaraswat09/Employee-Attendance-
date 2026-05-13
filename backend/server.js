import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { config } from "./src/config/config.js";

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start();