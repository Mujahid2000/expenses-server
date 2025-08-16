import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import expenseRoutes from "./router/expenseRoutes.js"
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./router/authRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/',async (req, res) =>{
      res.send('<h1>Welcome to the Course Management API</h1>');
  })

app.use("/expenses", expenseRoutes);
app.use("/auth", authRoutes);
// Error Handler
app.use(errorHandler);

//  Server start with db
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
