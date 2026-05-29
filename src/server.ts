import express from "express";
 import cors from "cors"
import "dotenv/config";
import userRoute from "./routes/userRoute.js";
import todoRoute from "./routes/todoRoute.js"

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

app.use("/api",userRoute)
app.use("/api", todoRoute)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});