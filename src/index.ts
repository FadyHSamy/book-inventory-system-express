import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import { connectToDatabase } from "./config/mongo";
import { loginUser, registerUser } from "./controllers/UserController";

const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3100;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
connectToDatabase();

// Routes
app.post("/user/register", registerUser);
app.post("/user/login", loginUser);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
