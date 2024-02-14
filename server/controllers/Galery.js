const express = require('express');
const mongoose = require('mongoose');
const Galery = require("../models/Galery");
const routerGalery = express.Router();

// Create
routerGalery.post("/", async (req, res) => {
  try {
    const newCourse = await Galery.create(req.body);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not create course" });
  }
});

// Read all
routerGalery.get("/", async (req, res) => {
  try {
    const courses = await Galery.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve courses" });
  }
});

// Read by ID
routerGalery.get("/:id", async (req, res) => {
  try {
    const course = await Galery.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve course" });
  }
});

// Update
routerGalery.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Galery.findByIdAndUpdate(
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
routerGalery.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Galery.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Could not delete course" });
  }
});


module.exports = routerGalery;