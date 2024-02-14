// controllers/CategorysController.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = require("../models/Category");

// Create
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: "Could not create Category" });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const Categorys = await Category.find();
    return res.status(200).json(Categorys);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve Categorys" });
  }
});

// Read by ID
router.get("/:id", async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);
    if (!Category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(Category);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve Category" });
  }
});

// Update
router.patch("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: "Could not update Category" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: "Could not update Category" });
  }
});
// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Could not delete Category" });
  }
});


module.exports = router;