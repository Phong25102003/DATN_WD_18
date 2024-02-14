const express = require('express');
const mongoose = require('mongoose');
const Product = require("../models/Product");
const routerProduct = express.Router();

// Create
routerProduct.post("/", async (req, res) => {
    try {
        const newCourse = await Product.create(req.body);
        return res.status(201).json(newCourse);
    } catch (error) {
        return res.status(500).json({ error: "Could not create course" });
    }
});

routerProduct.get("/", async (req, res) => {
    try {
        const { courseID } = req.query;
        if (courseID) {
            const filteredProduct = await Product.find({ courseID });
            return res.status(200).json(filteredProduct);
        }

        const allProduct = await Product.find();
        return res.status(200).json(allProduct);
    } catch (error) {
        return res.status(500).json({ error: "Could not retrieve Product" });
    }
});



// Read by ID
routerProduct.get("/:id", async (req, res) => {
    try {
        const course = await Product.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ error: "Could not retrieve course" });
    }
});

// Update
routerProduct.put("/:id", async (req, res) => {
    try {
        const updatedCourse = await Product.findByIdAndUpdate(
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
routerProduct.delete("/:id", async (req, res) => {
    try {
        const deletedCourse = await Product.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ error: "Could not delete course" });
    }
});

module.exports = routerProduct;