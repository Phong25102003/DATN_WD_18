const express = require('express');
const mongoose = require('mongoose');
const Order_item = require("../models/Order_item");


const routerOrder_items = express.Router();

// Create
routerOrder_items.post("/", async (req, res) => {
  try {
    const newCourse = await Order_item.create(req.body);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not create course" });
  }
});

// Read all
routerOrder_items.get("/", async (req, res) => {
  try {
    const courses = await Order_item.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve courses" });
  }
});

// Read by ID
routerOrder_items.get("/:id", async (req, res) => {
  try {
    const course = await Order_item.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve course" });
  }
});

// Update
routerOrder_items.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Order_item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not update course" });
  }
});

// Delete
routerOrder_items.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Order_item.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Could not delete course" });
  }
});

module.exports = routerOrder_items;