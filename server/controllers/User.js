const express = require('express');
const mongoose = require('mongoose');
const User = require("../models/User");
const routerUser = express.Router();

// Create
routerUser.post("/", async (req, res) => {
  try {
    const newCourse = await User.create(req.body);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not create course" });
  }
});

// Read all
routerUser.get("/", async (req, res) => {
  try {
    const courses = await User.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve courses" });
  }
});

// Read by ID
routerUser.get("/:id", async (req, res) => {
  try {
    const course = await User.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve course" });
  }
});

// Update
routerUser.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await User.findByIdAndUpdate(
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
routerUser.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await User.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Could not delete course" });
  }
});

module.exports = routerUser;