const express = require('express');
const mongoose = require('mongoose');
const Size = require("../models/Size");
const routerSize = express.Router();

// Create
routerSize.post("/", async (req, res) => {
  try {
    const newCourse = await Size.create(req.body);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not create course" });
  }
});

// Read all
routerSize.get("/", async (req, res) => {
  try {
    const courses = await Size.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve courses" });
  }
});

// Read by ID
routerSize.get("/:id", async (req, res) => {
  try {
    const course = await Size.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve course" });
  }
});

// Update
routerSize.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Size.findByIdAndUpdate(
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
routerSize.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Size.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Could not delete course" });
  }
});

module.exports = routerSize;