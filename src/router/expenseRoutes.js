import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

// All routes below require auth
router.use(protect);

// @POST /expenses → Add a new expense
router.post("/", async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
});

// @GET /expenses → Get all expenses for logged-in user
router.get("/", async (req, res, next) => {
  try {
    const query = { user: req.user.id };

    // Optional filters (category, from, to)
    const { category, from, to } = req.query;
    if (category) query.category = category;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
});

// @PATCH /expenses/:id → Update an expense (only specific)
router.put("/:id", async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
});

// @DELETE /expenses/:id → Delete an expense (only specific)
router.delete("/:id", async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
