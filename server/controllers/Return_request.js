const express = require('express');
const mongoose = require('mongoose');
const Return_request = require("../models/Return_request");

const routerVideoProgress = express.Router();

// Create
routerVideoProgress.post("/", async (req, res) => {
    try {
        const newCourse = await Return_request.create(req.body);
        return res.status(201).json(newCourse);
    } catch (error) {
        return res.status(500).json({ error: "Could not create course" });
    }
});

// Read all
routerVideoProgress.get("/", async (req, res) => {
    try {
        const courses = await Return_request.find();
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ error: "Could not retrieve courses" });
    }
});

// Read by ID
routerVideoProgress.get("/:id", async (req, res) => {
    try {
        const course = await Return_request.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ error: "Could not retrieve course" });
    }
});

// Update
routerVideoProgress.put("/:id", async (req, res) => {
    try {
        const updatedCourse = await Return_request.findByIdAndUpdate(
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
routerVideoProgress.delete("/:id", async (req, res) => {
    try {
        const deletedCourse = await Return_request.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ error: "Could not delete course" });
    }
});

module.exports = routerVideoProgress;